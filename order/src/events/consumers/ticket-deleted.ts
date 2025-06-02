import { Consumer, queueNames } from '@expasshub/utils';
import { Ticket } from '../../models/ticket';
import { AMQPMessage } from '@cloudamqp/amqp-client';

export const ticketDeletedConsumer = async (msg: AMQPMessage) => {
    const ticketData = JSON.parse(msg.bodyToString()!);
    try {
        const ticket = await Ticket.findById(ticketData.id);
        if (!ticket) {
            throw new Error('ticket not found');
        }
        if (ticket.version === ticketData.version - 1) {
            await ticket.delete();
            msg.ack();
        }
    } catch (error: any) {
        console.log(error.message, "find id");
    }
}

interface TicketDeletedType {
    queue: queueNames.TicketDeleted;
}

class TicketDeletedConsumer extends Consumer<TicketDeletedType> {
    queueName: queueNames.TicketDeleted = queueNames.TicketDeleted;
}

export const ticketDeletedQueue = new TicketDeletedConsumer();

