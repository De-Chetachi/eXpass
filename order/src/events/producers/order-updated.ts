import { Publisher, queueNames, exchange, keys, OrderData } from "@expasshub/utils";

interface OrderUpdatedData {
    queue: queueNames.OrderUpdated;
    bind: keys.OrderUpdated;
    exchanget: exchange.order;
    data: OrderData;
    
}
class OrderUpdated extends Publisher<OrderUpdatedData> {
    queueName: queueNames.OrderUpdated = queueNames.OrderUpdated;
    bindingKey: keys.OrderUpdated = keys.OrderUpdated;
    exchangeName: exchange.order = exchange.order;
}

export const orderUpdatedQueue = new OrderUpdated()