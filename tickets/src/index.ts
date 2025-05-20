//import mongoose from 'mongoose';
import { app } from './app';
import { Client } from 'pg';
import rabbit from './rabbit';
import { exchange } from './events/event_types';
import TicketCreatedEventHandler from './events/ticket_created';
import TicketDeletdEventHandler from './events/ticket_deleted';
import TicketUpdatedEventHandler from './events/ticket_updated';


if (!(process.env.PSQL_USER && process.env.PSQL_PASS && process.env.PSQL_DB && process.env.PSQL_HOST)) {
    throw new Error('psql connection parameters  required');
}

if(!process.env.AMQP_URL){
    throw new Error('rabbitmq url not set');
}


export const client = new Client({
    user: process.env.PSQL_USER,
    database: process.env.PSQL_DB,
    password: process.env.PSQL_PASS,
    host: process.env.PSQL_HOST,
    port: 5432,
});

const port = 5000;

client.connect().then( async () => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS tickets (
            id VARCHAR(225) NOT NULL,
            title VARCHAR(225) NOT NULL,
            price INT NOT NULL,
            userId VARCHAR(225) NOT NULL,
            PRIMARY KEY (id) 
        );
    `);
    console.log(process.env.AMQP_URL);
    await rabbit.connect(process.env.AMQP_URL!);
    await rabbit.exchange(exchange.ticket, 'direct');
    await TicketCreatedEventHandler.ticketCreatedQueue(rabbit);
    await TicketDeletdEventHandler.ticketDeletedQueue(rabbit);
    await TicketUpdatedEventHandler.ticketUpdatedQueue(rabbit);
    app.listen(port, () => {
        console.log(`ticket app is listening on port ${port}`);
    });
}).catch((err: Error) => {
    console.log(err.message);
});
//module.exports = client;