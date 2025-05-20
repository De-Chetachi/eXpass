import { Request, Response } from 'express';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '@expasshub/utils';
import Ticket from '../models/ticket_model';
import rabbit from '../rabbit';
import TicketCreatedEventHandler  from '../events/ticket_created';
import TicketUpdatedEventHandler from '../events/ticket_updated';
import TicketDeletdEventHandler from '../events/ticket_deleted';


class TicketController {
    //static ticketCreatedQueue = TicketCreatedEventHandler.ticketCreatedQueue(rabbit);
    //static ticketUpdatedQueue = TicketUpdatedEventHandler.ticketUpdatedQueue(rabbit);
    //static ticketDeletedQueue = TicketDeletdEventHandler.ticketDeletedQueue(rabbit);

    static async createTickets(req: Request, res: Response){
        try{
            const { title, price } = req.body;
            const userId = req.currentUser!.id;
            const ticket = Ticket.build({ title, price, userId });
            await ticket.save();
            console.log(ticket);
            await TicketCreatedEventHandler.publishTicketCreated(rabbit, {
                id: ticket.id,
                title: ticket.title,
                price: ticket.price,
                userId: ticket.userId,
            })
            res.status(201).json({ status: "success", message: "ticker successfully created", object: ticket })
        
        }catch(err) {
            console.log(err);
        } 
    }

    static async getTicket(req: Request, res: Response) {
        const id  = req.params.id;

        const ticket = await Ticket.findById(id);
        if (!ticket){
            throw new NotFoundError();
        }
        res.status(200).json({ status: "success", message: "ticket retrieved", object: ticket })
    }

    static async getTickets(req: Request, res: Response) {
        const tickets = await Ticket.findAll();
        res.status(200).json({ status: 'success', message: 'tickets retrieved', object: tickets })
    }

    static async deleteTicket(req: Request, res: Response) {
        const id = req.params.id;
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            throw new NotFoundError();
        }

        if (ticket.userId !== req.currentUser!.id){
            throw new NotAuthorizedError();
           }

        await ticket.delete();

        await TicketDeletdEventHandler.publishTicketDeleted(rabbit, {
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
        });
        res.json({ status: 'success', message: 'ticket deleted', object: null });
    }


    static async updateTicket(req: Request, res: Response) {
        const id = req.params.id;
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            throw new NotFoundError();
        }
        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        const { title, price } = req.body;
        ticket.title = title;
        ticket.price = price;
        await ticket.update();
        await TicketUpdatedEventHandler.publishTicketUpdated(rabbit, {
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
        });

        res.json({ status: 'success', message: 'ticket updated', object: ticket });
    }

}

export default TicketController; 