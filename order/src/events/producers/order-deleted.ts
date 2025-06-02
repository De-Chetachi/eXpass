import { Publisher, queueNames, exchange, keys, OrderData } from "@expasshub/utils";

interface OrderDeletedData {
    queue: queueNames.OrderDeleted;
    bind: keys.OrderDeleted;
    exchanget: exchange.order;
    data: OrderData;
    
}
class OrderDeleted extends Publisher<OrderDeletedData> {
    queueName: queueNames.OrderDeleted = queueNames.OrderDeleted;
    bindingKey: keys.OrderDeleted = keys.OrderDeleted;
    exchangeName: exchange.order = exchange.order;
}

export const orderDeletedQueue = new OrderDeleted()