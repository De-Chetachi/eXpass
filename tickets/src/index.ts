//import mongoose from 'mongoose';
import { app } from './app';
import { Client } from 'pg';
import { rabbit_events } from './rabbit';


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
            version INT NOT NULL,
            orderId VARCHAR,
            PRIMARY KEY (id)
        );
    `);
    await rabbit_events();
    app.listen(port, () => {
        console.log(`ticket app is listening on port ${port}`);
    });
}).catch((err: Error) => {
    console.log(err.message);
});
