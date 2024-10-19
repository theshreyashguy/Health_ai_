import { config } from '@notifications/config';
import {  IEmailLocals, winstonLogger } from '@theshreyashguy/coffee-shared';
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@notifications/queues/connection';
import * as admin from 'firebase-admin';

const serviceAccount = require('../../coffee-service-d0c4b-firebase-adminsdk-7zruc-202daaa5b0.json');

// const firebaseConfig = {
//   apiKey: "AIzaSyCyElw7leg5Fjg8UizTbiN0aNCot6U5tK4",
//   authDomain: "coffee-service-d0c4b.firebaseapp.com",
//   projectId: "coffee-service-d0c4b",
//   storageBucket: "coffee-service-d0c4b.appspot.com",
//   messagingSenderId: "681395351179",
//   appId: "1:681395351179:web:9638ad5acada7b1f0e2e8e",
//   measurementId: "G-9J27T1ZGZ3"
// };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://coffee-service-d0c4b.firebaseio.com'
});

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug');

async function consumeAuthNotificationMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = await createConnection() as Channel;
    }
    const exchangeName = 'coffee-push-notification';
    const routingKey = 'auth-email';
    const queueName = 'auth-push-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const object = JSON.parse(msg!.content.toString());
     // log.info(object.message);
     const message = {
      notification: {
        title: object.title,
        body: object.message,
      },
      token: object.token,
    };
      const response = await admin.messaging().send(message);
       log.info(`NOtification service message send successfully, ${response} `);
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'NotificationService EmailConsumer consumeAuthEmailMessages() method error:', error);
  }
}

async function consumeOrderNotificationMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = await createConnection() as Channel;
    }
    const exchangeName = 'coffee-order-notification';
    const routingKey = 'order-push';
    const queueName = 'order-push-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const { body, title, fcmToken } = JSON.parse(msg!.content.toString());
      if(!fcmToken || !body || !title){
        channel.ack(msg!);
      }
      else{
        const message : IEmailLocals = {
          title:title,
          message:body,
          token: fcmToken,
        };
         log.info(message);
         const response = await admin.messaging().send(message);
         log.info(`NOtification service message send successfully, ${response} `);
        channel.ack(msg!);
      }
    });
  } catch (error) {
    log.log('error', 'NotificationService EmailConsumer consumeOrderEmailMessages() method error:', error);
  }
}

export { consumeAuthNotificationMessages, consumeOrderNotificationMessages };