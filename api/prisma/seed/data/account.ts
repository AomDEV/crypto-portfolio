import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export default function account () {
    return [
        {
            id: uuidv4(),
            first_name: 'John',
            last_name: 'Doe',
            username: 'john',
            password: bcrypt.hashSync('password', 10),
            email: 'siriwat576@gmail.com',
            verified_at: new Date,
        }
    ];
}