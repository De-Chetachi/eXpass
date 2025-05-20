import { Rabbit } from "@expasshub/utils";
import { keys, TicketData, exchange, queueNames } from "./event_types";

class TicketDeletdEventHandler {
    static queueName: queueNames.TicketDeleted = queueNames.TicketDeleted;
    static routingKey: keys.TicketDeleted = keys.TicketDeleted;
    static exchangeName: exchange.TicketDeleted = exchange.TicketDeleted;
    static queue_: any;


    static get queue() {
        if (!this.queue_) {
            throw new Error('no queue declared yet');
        }
        return this.queue_;
    }

    static async ticketDeletedQueue(rab: Rabbit) {

        if (this.queue_){
            return this.queue_;
        }
        this.queue_ = await rab.queueAndBind(this.queueName, this.exchangeName, this.routingKey);
        return this.queue_;
    }

    static async publishTicketDeleted(rab: Rabbit, data: TicketData){
        const queue = this.queue;
        await rab.publish(queue, data);
    }
}

export default TicketDeletdEventHandler;