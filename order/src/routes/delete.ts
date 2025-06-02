import { OrderStatus, requireAuth, NotAuthorizedError, NotFoundError } from "@expasshub/utils";
import { Order } from "../models/order";
import { orderDeletedQueue } from "../events/producers/order-deleted";
import { Ticket } from "../models/ticket";
import { rabbit } from "../rabbit";
import express from "express";

const router = express.Router();
router.delete("/api/orders/:orderId", requireAuth, async (req, res, next) => {
    const orderId = req.params.orderId;

    //find the order
    const order = await Order.findById(orderId);
    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    await order.populate()
    //delete the order
    await order.delete();

    //emit order deleted event
    if (!(order.ticket instanceof Ticket)) {
        throw new Error('error populating ticket');
    }

    orderDeletedQueue.publish(rabbit, {
        id: order.id,
        userId: order.userId,
        status: OrderStatus.OrderCancelled,
        expiresAt: order.expiresAt,
        ticket: {
            id: order.ticket.id,
            title: order.ticket.title,
            price: order.ticket.price,
        }
    })



    res.status(204).json({ status: "success", message: "order successfully deleted", object: null });
});

export { router as deleteRouter };