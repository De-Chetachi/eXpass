import { app } from'../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { newDb } from 'pg-mem';

process.env.JWT_TOKEN = 'rdfghjkl';
declare global {
    var signIn: () => string[];
}

beforeAll(async () => {
    const db = newDb();
});

beforeEach(() => {

});

afterAll(() => {

}
)

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
