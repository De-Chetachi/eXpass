import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const asyncScrypt = promisify(scrypt);
export class Password {
    static async hashPassword(password: string) {

        const salt = randomBytes(8).toString('hex');
        const buf = (await asyncScrypt(password, salt, 64)) as Buffer;
        return `${buf.toString('hex')}.${salt}`;

    }

    static async comparePassword(storedPassword: string, suppliedPassword: string){
        const [ oldHash, salt ] = storedPassword.split('.');

        const newHash = (await asyncScrypt(suppliedPassword, salt, 64)) as Buffer;

        return newHash.toString('hex') === oldHash;

    }
}