import express from 'express';
import  TicketController from '../controllers/ticket_controller';
import { requireAuth } from '@expasshub/utils';

const router = express.Router();
router.post('/', requireAuth, TicketController.getTickets);
module.exports = router;