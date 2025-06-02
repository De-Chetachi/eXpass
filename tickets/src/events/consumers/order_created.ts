import { Consumer, queueNames, NotFoundError } from '@expasshub/utils';
import Ticket from '../../models/ticket_model';
import { AMQPMessage } from '@cloudamqp/amqp-client';
import { ticketUpdatedQueue } from '../producers/ticket_updated';
import rabbit from '../../rabbit';

export const orderCreatedConsumer = async (msg: AMQPMessage) => {
    const orderData = JSON.parse(msg.bodyToString()!);
    const ticket = await Ticket.findById(orderData.ticket.id)
    if (!ticket) {
        console.log('ticket not found for order created event');
        throw new NotFoundError();
    }
    ticket.orderId = orderData.id;
    ++ticket.version;
    await ticket.update();
    //emit ticket updated event
    await ticketUpdatedQueue.publish(rabbit, {
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        version: ticket.version,
        userId: ticket.userId,
    });

    msg.ack();
}

interface OrderCreatedType {
    queue: queueNames.OrderCreated;
}

class OrderCreatedConsumer extends Consumer<OrderCreatedType> {
    queueName: queueNames.OrderCreated = queueNames.OrderCreated; 
}

export const orderCreatedQueue = new OrderCreatedConsumer();