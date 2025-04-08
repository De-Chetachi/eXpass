//import mongoose from 'mongoose';
import { app } from './app';
const { Client } = require('pg');

if (!(process.env.PSQL_USER && process.env.PSQL_PASS && process.env.PSQL_DB && process.env.PSQL_HOST)) {
    throw new Error('psql connection parameters  required');
}

const client = new Client({
    user: process.env.PSQL_USER,
    database: process.env.PSQL_DB,
    password: process.env.PSQL_PASS,
    host: process.env.PSQL_HOST,
    port: 5432,
});
const port = 5000;

client.connect().then(() => {
    client.query(`
        CREATE TABLE IF NOT EXISTS tickets (
            id VARCHAR(225) NOT NULL,
            title VARCHAR(225) NOT NULL,
            price INT NOT NULL,
            PRIMARY KEY (id) 
        );
    `)
    app.listen(port, () => {
        console.log(`ticket app is listening on port ${port}`);
    })
}).catch((err: Error) => {
    console.log(err.message);
});
module.exports = client;