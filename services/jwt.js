import jwt from 'jwt-simple';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();
var secret = process.env.JWT_SECRET;

function createToken(user){
    var payload = {
        sub:user.id,
        role:user.role,
        name:user.name,
        iat:moment().unix(),
        exp:moment().add(1, 'day').unix()
    }
    return jwt.encode(payload, secret);
}

export default {createToken};

