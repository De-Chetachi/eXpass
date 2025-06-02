import { router } from "../app";
import { OrderStatus, requireAuth, NotAuthorizedError, NotFoundError } from "@expasshub/utils";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { orderUpdatedQueue } from "../events/producers/order-updated";
import { rabbit } from "../rabbit";
import express from "express";


//const router = express.Router();
router.put("/cancel/:orderId", requireAuth, async (req, res, next) => {
    const { orderId } = req.params;
    const { ticketId } = req.body;

    //find the order
    const order = await Order.findById(orderId);
    if (!order) {
        throw new NotFoundError();
    }
    
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    order.status = OrderStatus.OrderCancelled
    order.populate();
    if(!(order.ticket instanceof Ticket)){
        throw new Error('error populatin order ticket')
    }
    order.update();

    //emit order cancelled event
    orderUpdatedQueue.publish(rabbit, {
        id: order.id,
        userId: order.userId,
        status: OrderStatus.OrderCancelled,
        expiresAt: order.expiresAt,
        ticket: {
            id: order.ticket.id,
            title: order.ticket.title,
            price: order.ticket.price,
        }
    });

    res.status(203).json({ status: "success", message: "order successfully updated", object: order });
});

//export { router as updateRouter };