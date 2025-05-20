import { Rabbit } from "@expasshub/utils";
import { keys, queueNames, exchange, TicketData } from "./event_types";

class TicketUpdatedEventHandler {
    static queueName: queueNames.TicketUpdated = queueNames.TicketUpdated;
    static routingKey: keys.TicketUpdated = keys.TicketUpdated;
    static exchangeName: exchange.TicketUpdated = exchange.TicketUpdated;
    static queue_: any;

    static get queue() {
        if (!this.queue_) {
            throw new Error('no queue declared yet');
        }
        return this.queue_;
    }

    static async ticketUpdatedQueue(rab: Rabbit) {
        if (this.queue_){
            return this.queue_;
        }

        this.queue_ = await rab.queueAndBind(this.queueName, this.exchangeName, this.routingKey);
        return this.queue_;
    }

    static async publishTicketUpdated(rab: Rabbit, data: TicketData) {
        const queue = this.queue;
        await rab.publish(queue, data)
    }
}

export default TicketUpdatedEventHandler;