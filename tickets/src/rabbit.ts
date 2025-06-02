import  { Rabbit } from '@expasshub/utils'
import { ticketCreatedQueue } from './events/producers/ticket_created';
import { ticketUpdatedQueue } from './events/producers/ticket_updated';
import { ticketDeletedQueue }from './events/producers/ticket_deleted';
import { orderCreatedQueue, orderCreatedConsumer } from './events/consumers/order_created';
import { exchange } from '@expasshub/utils';

const rabbit = new Rabbit();

export const rabbit_events = async () => {
    await rabbit.connect(process.env.AMQP_URL!);
    await rabbit.exchange(exchange.ticket, 'direct');
    await ticketCreatedQueue.bindQueue(rabbit);
    await ticketDeletedQueue.bindQueue(rabbit);
    await ticketUpdatedQueue.bindQueue(rabbit);
    await orderCreatedQueue.startQueue(rabbit);
    await orderCreatedQueue.consume(rabbit, orderCreatedConsumer);

}
export default rabbit;