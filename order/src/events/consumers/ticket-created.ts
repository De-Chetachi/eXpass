import { Consumer, queueNames } from '@expasshub/utils';
import { Ticket } from '../../models/ticket';
import { AMQPMessage } from '@cloudamqp/amqp-client';

export const ticketCreatedConsumer = async (msg: AMQPMessage) => {
    try {
        const ticketData = JSON.parse(msg.bodyToString()!);
        const ticket = await Ticket.build({
            id: ticketData.id,
            title: ticketData.title,
            price: ticketData.price,
            version: ticketData.version,
        });
        await ticket.save();
        msg.ack();
    } catch (error:any) {
        console.log(error);
    }
}

interface TicketCreatedType {
    queue: queueNames.TicketCreated;
}

class TicketCreatedConsumer extends Consumer<TicketCreatedType> {
    queueName: queueNames.TicketCreated = queueNames.TicketCreated; 
}

export const ticketCreatedQueue = new TicketCreatedConsumer();

