import { AMQPChannel, AMQPClient, AMQPQueue, AMQPError } from "@cloudamqp/amqp-client"

interface RabbitMQConfig {
  url: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface ExchangeOptions {
  durable?: boolean;
  autoDelete?: boolean;
  internal?: boolean;
}

interface QueueOptions {
  durable?: boolean;
  exclusive?: boolean;
  autoDelete?: boolean;
}

class RabbitMQClient {
    private client: AMQPClient | null = null;
    private channel: AMQPChannel | null = null;
    private isConnected = false;
    private reconnectAttempts = 0;
    private config: RabbitMQConfig;

    constructor(config: RabbitMQConfig) {
        this.config = {
            reconnect: true,
            reconnectInterval: 5000,
            maxReconnectAttempts: 5,
            ...config
        };
    }

    async connect(): Promise<AMQPChannel> {
        if (this.isConnected && this.channel) {
            return this.channel;
        }

        try {
            this.client = new AMQPClient(this.config.url);
            const conn = await this.client.connect();
            this.channel = await conn.channel();
            this.isConnected = true;
            this.reconnectAttempts = 0;
            
            // Setup connection error handlers
            conn.onerror = this.handleConnectionError.bind(this);
            conn.onclose = this.handleConnectionClose.bind(this);
            
            return this.channel;
        } catch (error) {
            this.cleanup();
            throw new Error(`Connection failed: ${error.message}`);
        }
    }

    private handleConnectionError(error: AMQPError) {
        console.error('RabbitMQ connection error:', error);
    }

    private handleConnectionClose() {
        this.isConnected = false;
        if (this.config.reconnect && this.reconnectAttempts < this.config.maxReconnectAttempts) {
            setTimeout(() => {
                this.reconnectAttempts++;
                console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);
                this.connect().catch(err => console.error('Reconnect failed:', err));
            }, this.config.reconnectInterval);
        }
    }

    private cleanup() {
        this.isConnected = false;
        this.channel = null;
        // Don't close client here as it might trigger recursive reconnects
    }

    async disconnect(): Promise<void> {
        try {
            if (this.client) {
                await this.client.close();
            }
        } catch (error) {
            console.error('Error during disconnect:', error);
        } finally {
            this.cleanup();
        }
    }

    async declareExchange(
        name: string, 
        type: 'direct' | 'fanout' | 'topic' | 'headers',
        options: ExchangeOptions = {}
    ): Promise<void> {
        if (!this.channel) throw new Error('Not connected to RabbitMQ');
        await this.channel.exchangeDeclare(name, type, options);
    }

    async declareQueue(
        name: string,
        options: QueueOptions = {}
    ): Promise<AMQPQueue> {
        if (!this.channel) throw new Error('Not connected to RabbitMQ');
        return this.channel.queue(name, options);
    }

    async bindQueue(
        queueName: string,
        exchangeName: string,
        routingKey: string
    ): Promise<void> {
        if (!this.channel) throw new Error('Not connected to RabbitMQ');
        await this.channel.queueBind(queueName, exchangeName, routingKey);
    }

    async publish(
        exchange: string,
        routingKey: string,
        message: object,
        options?: { persistent?: boolean }
    ): Promise<void> {
        if (!this.channel) throw new Error('Not connected to RabbitMQ');
        const messageBuffer = JSON.stringify(message);
        await this.channel.basicPublish(exchange, routingKey, messageBuffer, options);
    }

    async consume(
        queueName: string,
        onMessage: (msg: any) => Promise<void>,
        options?: { noAck?: boolean }
    ): Promise<string> {
        if (!this.channel) throw new Error('Not connected to RabbitMQ');
        return this.channel.basicConsume(queueName, async (msg) => {
            try {
                const content = JSON.parse(msg.bodyToString());
                await onMessage(content);
                if (!options?.noAck) {
                    msg.ack();
                }
            } catch (error) {
                console.error('Error processing message:', error);
                if (!options?.noAck) {
                    msg.nack(); // Negative acknowledgement
                }
            }
        }, options);
    }

    get isConnectionOpen(): boolean {
        return this.isConnected;
    }
}

export default RabbitMQClient;