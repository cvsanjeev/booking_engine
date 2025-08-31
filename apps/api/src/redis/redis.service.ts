import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  async onModuleInit() {
    // Make sure Redis is connected
    await this.client.ping();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    if (ttl) {
      return this.client.set(key, value, 'EX', ttl);
    }
    return this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async acquireLock(key: string, ttl: number): Promise<boolean> {
    // Fix the Redis set call syntax
    const result = await this.client.set(
      `lock:${key}`,
      Date.now().toString(),
      'EX', 
      ttl,
      'NX'
    );
    return result === 'OK';
  }

  async releaseLock(key: string): Promise<number> {
    return this.client.del(`lock:${key}`);
  }
}