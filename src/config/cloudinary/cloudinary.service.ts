import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService implements OnModuleInit {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(@Inject('CLOUDINARY') private readonly cloudinary: typeof v2) {}

  async onModuleInit() {
    try {
      await this.cloudinary.api.usage();
      this.logger.log('✅ Cloudinary connection established successfully!');
    } catch (error) {
      this.logger.error('❌ Failed to connect to Cloudinary:', error.message);
      process.exit(1); 
    }
  }
}
