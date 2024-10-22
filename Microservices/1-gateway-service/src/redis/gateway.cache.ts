import { config } from '@gateway/config';
import { winstonLogger , IAuthDocument} from '@theshreyashguy/coffee-shared';
import { Logger } from 'winston';
import { createClient } from 'redis';

type RedisClient = ReturnType<typeof createClient>;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gatewayCache', 'debug');



class GatewayCache {
  client: RedisClient;

  constructor() {
    this.client = createClient({ url: `${config.REDIS_HOST}` });
  }

  // 1. Add User Info to Cache
  public async saveUserInfoToCache(id: string, userInfo: IAuthDocument, ttlSeconds: number = 86400): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.HSET('users', id, JSON.stringify(userInfo));
      await this.client.EXPIRE('users', ttlSeconds); // Set expiration for the hash key 'users'
      log.info(`User info for ${userInfo.username} added/updated in cache with a TTL of ${ttlSeconds} seconds`);
    } catch (error) {
      log.log('error', 'GatewayService Cache saveUserInfoToCache() method error:', error);
    }
  }
  

  // 2. Remove User Info from Cache
  public async removeUserInfoFromCache(id: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.HDEL('users', id); // Remove user from the hash map
      log.info(`User info for ${id} removed from cache`);
    } catch (error) {
      log.log('error', 'GatewayService Cache removeUserInfoFromCache() method error:', error);
    }
  }

  // 3. Get User Info from Cache
  public async getUserInfoFromCache(id: string): Promise<string | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      log.info(id)
      const userInfo: string | undefined = await this.client.HGET('users', id);
      if (userInfo) {
        log.info(`User info for ${id} retrieved from cache ${userInfo}`);
        return userInfo;
      }
      log.info(`User info for ${id} not found in cache`);
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


export const gatewayCache : GatewayCache = new GatewayCache();
