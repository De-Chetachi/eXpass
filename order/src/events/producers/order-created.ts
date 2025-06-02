import { Publisher, queueNames, exchange, keys, OrderData } from "@expasshub/utils";


interface OrderCreatedData {
    queue: queueNames.OrderCreated;
    bind: keys.OrderCreated;
    exchanget: exchange.order;
    data: OrderData;
    
}
class OrderCreated extends Publisher<OrderCreatedData> {
    queueName: queueNames.OrderCreated = queueNames.OrderCreated;
    bindingKey: keys.OrderCreated = keys.OrderCreated;
    exchangeName: exchange.order = exchange.order;
}

export const orderCreatedQueue = new OrderCreated()
