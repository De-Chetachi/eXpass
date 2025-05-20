export enum queueNames {
    TicketCreated = 'ticket.created',
    TicketUpdated = 'ticket.updated',
    TicketDeleted = 'ticket.deleted',
};

export enum exchange {
    ticket = 'tickets',
    TicketCreated = 'tickets',
    TicketUpdated = 'tickets',
    TicketDeleted = 'tickets',
}

export enum keys {
    TicketCreated = 'ticket_created',
    TicketUpdated = 'ticket_updated',
    TicketDeleted = 'ticket_deleted',
}

export interface TicketData{
    id: string;
    title: string;
    price: number;
    userId: string;
}