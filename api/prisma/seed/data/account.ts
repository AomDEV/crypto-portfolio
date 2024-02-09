import * as bcrypt from 'bcrypt';
export default function account () {
    return [
        {
            first_name: 'John',
            last_name: 'Doe',
            username: 'john',
            password: bcrypt.hashSync('password', 10),
            email: 'siriwat576@gmail.com',
            verified_at: new Date,
        }
    ];
}