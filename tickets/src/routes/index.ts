import express from 'express';
import { body, validationResult } from 'express-validator';
import  TicketController from '../controllers/ticket_controller';
import { requireAuth, authValidationHandler } from '@expasshub/utils';

const router = express.Router();
router.post('/', requireAuth, [
    body('title').notEmpty()
    .withMessage('title is required'),
    body('price').isFloat({ gt: 0 })
    .withMessage('price must be a number greater than zero')
], authValidationHandler, TicketController.getTickets);

router.get('/:id', TicketController.getTicket);

module.exports = router;