import { HttpException, HttpStatus, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Admin, Consumer, Kafka, Producer } from "kafkajs";

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private producer: Producer;
    private admin: Admin;
    private consumers: Set<Consumer> = new Set();
    private logger: Logger;
    constructor() {
        this.kafka = new Kafka({ brokers: ['localhost:9092'] });
        this.producer = this.kafka.producer();
        this.admin = this.kafka.admin();
        this.logger = new Logger(KafkaService.name);
    }

    async onModuleInit() {
        await this.producer.connect();
        await this.admin.connect();
        await this.consumeUserExistsResponse(); // ✅ Bắt đầu lắng nghe phản hồi
    }

    /**
     * 🔹 Gửi yêu cầu kiểm tra user
     */
    async checkUserExists(userId: string): Promise<void> {
        try {
            await this.producer.send({
                topic: 'check-user-exists',
                messages: [{ value: JSON.stringify({ userId }) }],
            });
            console.log(`📩 Sent request to check user: ${userId}`);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 🔹 Lắng nghe phản hồi từ Kafka topic "user-exists-response"
     */
    private async consumeUserExistsResponse() {
        const consumer: Consumer = this.kafka.consumer({ groupId: 'user-service-group' });
        await consumer.connect();
        await consumer.subscribe({ topic: 'user-exists-response', fromBeginning: true });

        // ✅ Lưu consumer để quản lý sau này
        this.consumers.add(consumer);

        await consumer.run({
            eachMessage: async ({ message }) => {
                if (!message.value) return;
                const response = JSON.parse(message.value.toString());

                console.log(`✅ Received response:`, response);
                // 🔹 Có thể xử lý logic tại đây, ví dụ gọi API khác hoặc cập nhật DB
            },
        });
    }

    async checkAndWaitForUserExists(userId: string): Promise<boolean> {
        try {
            // Gửi message kiểm tra user
            await this.producer.send({
                topic: "check-user-exists",
                messages: [{ value: JSON.stringify({ userId }) }],
            });
            this.logger.log(`📩 Sent request to check user: ${userId}`);
    
            const consumer = this.kafka.consumer({ groupId: "chat-service-group" });
    
            await consumer.connect();
            await consumer.subscribe({ topic: "user-exists-response", fromBeginning: false });
    
            // Tạo Promise chờ phản hồi
            const responsePromise = new Promise<boolean>(async (resolve, reject) => {
                await consumer.run({
                    eachMessage: async ({ message }) => {
                        if (!message.value) return;
    
                        const response = JSON.parse(message.value.toString());
    
                        if (response.userId === userId) {
                            this.logger.log(`✅ Received response for userId=${userId}: ${response.userExists}`);
                            await consumer.disconnect(); // Ngừng lắng nghe
                            resolve(response.userExists);
                        }
                    },
                });
            });
    
            // Promise timeout nếu không có phản hồi
            // const timeoutPromise = new Promise<boolean>((_, reject) => {
            //     const timeoutId = setTimeout(async () => {
            //         await consumer.disconnect(); // Đóng consumer nếu timeout
            //         reject(new HttpException("Kafka timeout: No response received", HttpStatus.REQUEST_TIMEOUT));
            //     }, 5000);
            // });
    
            // Đợi phản hồi hoặc timeout
            return await Promise.race([responsePromise]);
        } catch (error) {
            this.logger.error("❌ Error checking user existence:", error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
    

    async onModuleDestroy() {
        await this.producer.disconnect();
        await this.admin.disconnect();
        for (const consumer of this.consumers) {
            await consumer.disconnect();
        }
    }
}
