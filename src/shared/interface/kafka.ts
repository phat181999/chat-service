
export interface Message { 
    sender: string;
    receiver: string;
}

export interface KafkaMessage {
    key: string;
    value: string;
}
export interface KafkaMessageWithOffset {
    value: string | Message;
    offset?: string;
    partition?: number;
    topic?: string;
}
export interface KafkaMessageWithKey {
    key: string;
    value: string | Message;
    offset?: string;
    partition?: number;
    topic?: string;
}
export interface KafkaMessageWithKeyAndOffset {
    key: string;
    value: string | Message;
    offset: string;
    partition: number;
    topic: string;
}
export interface KafkaMessageWithKeyAndOffsetAndPartition {
    key: string;
    value: string | Message;
    offset: string;
    partition: number;
    topic: string;
}
