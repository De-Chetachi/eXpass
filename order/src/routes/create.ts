//import { router } from '../app';
import { rabbit } from '../rabbit';
import { OrderStatus, requireAuth, NotAuthorizedError, NotFoundError, BadRequestError } from '@expasshub/utils';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { orderCreatedQueue } from '../events/producers/order-created';
import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();
router.post('/api/orders/:ticketId', requireAuth, async (req: Request, res: Response) => {
    const ticketId = req.params.ticketId;
    //find the ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new NotFoundError();
    }
    //make sure that it is available
    if (await ticket.isReserved()) {
        throw new BadRequestError('ticket is already reserved');
    }

    //create an order
    const userId = req.currentUser!.id;
    const order = await Order.build({ userId, ticket });
    await order.populate();
    console.log('order populated:', order);
    await order.save();
    //emit order created event


    if (!(order.ticket instanceof Ticket)){
        throw new Error('error populating ticket');
    }
    orderCreatedQueue.publish(rabbit,{
        id: order.id,
        userId: order.userId,
        status: OrderStatus.OrderCreated,
        expiresAt: order.expiresAt,
        ticket: {
            id: order.ticket.id,
            title: order.ticket.title,
            price: order.ticket.price,
        }
    })

    //return the order
    res.status(201).json({ status: "success", message: "order successfully created", object: order })

});

export { router as createRouter };