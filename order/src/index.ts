import { Client } from 'pg';
import { app } from './app';
import { rabbit_events } from './rabbit';

const pass = process.env.PSQL_PASS;
const user = process.env.PSQL_USER;
const host = process.env.PSQL_HOST;
const db = process.env.PSQL_DB;

if (!(user && pass && host && db)) {
    throw new Error('psql connection parameters required');
}
if (!process.env.AMQP_URL) {
    throw new Error('rabbit mq url not set');
}
console.log(process.env.PSQL_USER, 1);
console.log(process.env.PSQL_PASS, 2);
console.log(process.env.PSQL_HOST, 3);
console.log(process.env.PSQL_DB, 4);
export const client = new Client({
    user: user,
    database: db,
    password: pass,
    host: host,
    port: 5432
});


const ampq_url = process.env.AMQP_URL;

const port = 5000;

client.connect().then( async ()=>{
    await client.query(`
        CREATE TABLE IF NOT EXISTS tickets (
            id VARCHAR(225) PRIMARY KEY,
            title VARCHAR(225) NOT NULL,
            price INT NOT NULL,
            version INT NOT NULL
        );

        DROP TABLE IF EXISTS orders;

        CREATE TABLE IF NOT EXISTS orders (
            id VARCHAR(225) PRIMARY KEY,
            userId VARCHAR(225) NOT NULL,
            status VARCHAR(225) NOT NULL,
            expiresAt TIMESTAMP NOT NULL,
            version INT NOT NULL,
            ticketId VARCHAR(225) REFERENCES tickets
        );

    `)
    await rabbit_events(ampq_url);
    
    app.listen(port, () => {
        console.log(`order is listening on port ${port}`);
    })
}).catch((err: Error)=>{
    console.log(err.message);
});
