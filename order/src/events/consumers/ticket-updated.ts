import { Consumer, queueNames } from '@expasshub/utils';
import { Ticket } from '../../models/ticket';
import { AMQPMessage } from '@cloudamqp/amqp-client';

export const ticketUpdatedConsumer = async (msg: AMQPMessage) => {
    const ticketData = JSON.parse(msg.bodyToString()!);
    const ticket = await Ticket.findById(ticketData.id);
    if (!ticket) {
        throw new Error('ticket not found');
    }

    if (ticket.version === ticketData.version - 1) {
        await ticket.update();
        msg.ack();
    }
}

interface TicketUpdatedType {
    queue: queueNames.TicketUpdated;
}

class TicketUpdatedConsumer extends Consumer<TicketUpdatedType> {
    queueName: queueNames.TicketUpdated = queueNames.TicketUpdated;
}

export const ticketUpdatedQueue = new TicketUpdatedConsumer();


