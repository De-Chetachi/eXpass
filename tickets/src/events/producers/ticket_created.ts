import { Rabbit, Publisher, queueNames, exchange, keys, TicketData } from "@expasshub/utils"

interface TicketCreatedType {
    queue: queueNames.TicketCreated;
    bind: keys.TicketCreated;
    exchanget: exchange.ticket;
    data: TicketData
}

class TicketCreated extends Publisher<TicketCreatedType> {
    queueName: queueNames.TicketCreated = queueNames.TicketCreated;
    bindingKey: keys.TicketCreated = keys.TicketCreated;
    exchangeName: exchange.ticket = exchange.ticket;
}

export const ticketCreatedQueue = new TicketCreated();