import { config } from '@gateway/config';
import { winstonLogger } from '@theshreyashguy/coffee-shared';
import { Logger } from 'winston';
import { createClient } from 'redis';

type RedisClient = ReturnType<typeof createClient>;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gatewayCache', 'debug');

export class GatewayCache {
  client: RedisClient;

  constructor() {
    this.client = createClient({ url: `${config.REDIS_HOST}` });
  }

  // 1. Add User Info to Cache
  public async saveUserInfoToCache(username: string, userInfo: string, ttlSeconds: number = 86400): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.HSET('users', username, userInfo);
      await this.client.EXPIRE('users', ttlSeconds); // Set expiration for the hash key 'users'
      log.info(`User info for ${username} added/updated in cache with a TTL of ${ttlSeconds} seconds`);
    } catch (error) {
      log.log('error', 'GatewayService Cache saveUserInfoToCache() method error:', error);
    }
  }
  

  // 2. Remove User Info from Cache
  public async removeUserInfoFromCache(username: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.HDEL('users', username); // Remove user from the hash map
      log.info(`User info for ${username} removed from cache`);
    } catch (error) {
      log.log('error', 'GatewayService Cache removeUserInfoFromCache() method error:', error);
    }
  }

  // 3. Get User Info from Cache
  public async getUserInfoFromCache(username: string): Promise<string | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const userInfo: string | undefined = await this.client.HGET('users', username);
      if (userInfo) {
        log.info(`User info for ${username} retrieved from cache`);
        return userInfo;
      }
      log.info(`User info for ${username} not found in cache`);
      return null;
    } catch (error) {
      log.log('error', 'GatewayService Cache getUserInfoFromCache() method error:', error);
      return null;
    }
  }

  // 4. Update User Info in Cache
  public async updateUserInfoInCache(username: string, newUserInfo: string, ttlSeconds: number = 86400): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.HSET('users', username, newUserInfo);
      await this.client.EXPIRE('users', ttlSeconds); // Reset expiration on update
      log.info(`User info for ${username} updated in cache with a TTL of ${ttlSeconds} seconds`);
    } catch (error) {
      log.log('error', 'GatewayService Cache updateUserInfoInCache() method error:', error);
    }
  }
  
}
