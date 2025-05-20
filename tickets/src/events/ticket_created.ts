import { Rabbit } from "@expasshub/utils"
import { queueNames, exchange, keys, TicketData } from "./event_types"

class TicketCreatedEventHandler {
    static queueName: queueNames.TicketCreated = queueNames.TicketCreated;
    static routingKey: keys.TicketCreated = keys.TicketCreated;
    static exchangeName: exchange.TicketCreated = exchange.TicketCreated;
    static queue_: any;

    static get queue() {
        if (!this.queue_) {
            throw new Error('no queue declared yet')
        }
        return this.queue_;
    }

    static async ticketCreatedQueue(rab: Rabbit) {
        if (this.queue_) {
            return this.queue_;
        }
        this.queue_ = await rab.queueAndBind(this.queueName, this.exchangeName, this.routingKey);
        return this.queue_;
    }

    static async publishTicketCreated(rab: Rabbit, data: TicketData)  {
        const queue = this.queue;
        await rab.publish(queue, data)
    }
}

export default TicketCreatedEventHandler;