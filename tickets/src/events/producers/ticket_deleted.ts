import { Rabbit, Publisher, queueNames, exchange, keys, TicketData } from "@expasshub/utils"

interface TicketDeletedType {
    queue: queueNames.TicketDeleted;
    bind: keys.TicketDeleted;
    exchanget: exchange.ticket;
    data: TicketData
}

class TicketDeleted extends Publisher<TicketDeletedType> {
    queueName: queueNames.TicketDeleted = queueNames.TicketDeleted;
    bindingKey: keys.TicketDeleted = keys.TicketDeleted;
    exchangeName: exchange.ticket = exchange.ticket;
}

export const ticketDeletedQueue = new TicketDeleted();


