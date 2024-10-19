import 'express-async-errors';
import http from 'http';

import { winstonLogger } from '@theshreyashguy/coffee-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';

async function sendTestEmailMessage() {
  try {
    const channel: Channel = await createConnection() as Channel;

    const exchangeName = 'jobber-email-notification';
    const routingKey = 'auth-email';

    await channel.assertExchange(exchangeName, 'direct');

    const testMessage = {
      receiverEmail: '21241@iiitu.ac.in',
      username: 'testuser',
      verifyLink: 'https://example.com/verify',
      resetLink: 'https://example.com/reset',
      template: 'verifyEmail', 
    };

    channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(testMessage))
    );

    console.log('Test email message sent to RabbitMQ');
  } catch (error) {
    console.error('Error sending test email message:', error);
  }
}


const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export function start(app: Application): void {
  startServer(app);
  app.use('', healthRoutes());
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
  const emailChannel: Channel = await createConnection() as Channel;
  await consumeAuthEmailMessages(emailChannel);
  await consumeOrderEmailMessages(emailChannel);
  sendTestEmailMessage();
}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification server has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method:', error);
  }
}