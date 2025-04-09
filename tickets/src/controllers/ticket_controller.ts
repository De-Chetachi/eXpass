import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '@expasshub/utils';
import Ticket from '../models/ticket_model';

class TicketController {
    static async getTickets(req: Request, res: Response){
        const { title, price } = req.body;
        const userId = req.currentUser!.id;
        const ticket = Ticket.build({ title, price, userId });
        ticket.save();
        res.status(201).json({ status: "success", message: "ticker successfully created", object: ticket })
    }

    static async getTicket(req: Request, res: Response) {
        const id  = req.params.id;

        const ticket = await Ticket.findById(id);
        if (!ticket){
            throw new NotFoundError();
        }
        res.status(200).json({ status: "success", message: "ticket retrieved", object: ticket })
    }
}

export default TicketController; 