import { app } from'../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { Password } from '@expasshub/utils';


const { Client } = require('pg');

process.env.JWT_TOKEN = 'rdfghjkl';
declare global {
    var signIn: () => string[];
}

const client = new Client({
    password: "my_pass"
});

beforeAll(async () => {
    await client.connect().then( async ()=> {

        try {
            await client.query(`
                CREATE TABLE tickets(
                    id VARCHAR(225) NOT NULL,
                    title VARCHAR(225) NOT NULL,
                    price INT NOT NULL,
                    userId VARCHAR(225) NOT NULL,
                    PRIMARY KEY (id)
                );
            `);
            console.log('success');
        } catch (err: any) {
            console.log(err.message);
        }
    });
});

beforeEach(async () => {
    await client.query('DELETE FROM tickets;');
});

afterAll( async () => {
    await client.query('DROP TABLE tickets;');
    client.end();
});

global.signIn = () => {
//the aim of this fxn is to fake auth
    //build a jwt payload {id, email, username}
    const payload = {
        id: 'dghoi98y7trdt',
        username: 'cheta',
        email: 'cheta@gmail.com'
    }

    //create the jwt token
    const token = jwt.sign(payload, process.env.JWT_TOKEN!, { expiresIn:  3 * 24 * 60 * 60 });

    //build a session
    const session = { token };
    const json_ = JSON.stringify(session);

    //encode json base64
    const base64 = Buffer.from(json_).toString('base64');
    return [`session=${base64}`];
}

module.exports = client;
