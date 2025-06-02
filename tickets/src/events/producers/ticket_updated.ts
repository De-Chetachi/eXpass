import { Rabbit, Publisher, queueNames, exchange, keys, TicketData } from "@expasshub/utils"


interface TicketUpdatedType {
    queue: queueNames.TicketUpdated;
    bind: keys.TicketUpdated;
    exchanget: exchange.ticket;
    data: TicketData
}

class TicketUpdated extends Publisher<TicketUpdatedType> {
    queueName: queueNames.TicketUpdated = queueNames.TicketUpdated;
    bindingKey: keys.TicketUpdated = keys.TicketUpdated;
    exchangeName: exchange.ticket = exchange.ticket;
}

export const ticketUpdatedQueue = new TicketUpdated();