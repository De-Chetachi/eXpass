import { Rabbit } from "@expasshub/utils";
import { orderCreatedQueue } from "./events/producers/order-created";
import { orderDeletedQueue } from "./events/producers/order-deleted";   
import { orderUpdatedQueue } from "./events/producers/order-updated";
import { ticketCreatedQueue, ticketCreatedConsumer } from "./events/consumers/ticket-created";
import { ticketDeletedQueue, ticketDeletedConsumer} from "./events/consumers/ticket-deleted";
import { ticketUpdatedQueue, ticketUpdatedConsumer }  from "./events/consumers/ticket-updated";
import { exchange } from "@expasshub/utils";


export const rabbit = new Rabbit();

export const rabbit_events = async (amqp_url: string) => {
    await rabbit.connect(amqp_url);
    await rabbit.exchange(exchange.order, 'direct');
    await orderCreatedQueue.bindQueue(rabbit);
    await orderDeletedQueue.bindQueue(rabbit);
    await orderUpdatedQueue.bindQueue(rabbit);
    await ticketCreatedQueue.startQueue(rabbit);
    await ticketCreatedQueue.consume(rabbit, ticketCreatedConsumer);
    await ticketDeletedQueue.startQueue(rabbit);
    //await ticketDeletedQueue.consume(rabbit, ticketDeletedConsumer);
    await ticketUpdatedQueue.startQueue(rabbit);
    //await ticketUpdatedQueue.consume(rabbit, ticketUpdatedConsumer);
    console.log('rabbitmq connected done');
}