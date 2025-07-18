import jwt from 'jwt-simple';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();
var secret = process.env.JWT_SECRET; // Se obtiene la clave del .env

// Función para crear un token JWT
function createToken(user){
    var payload = {
        sub:user.id,
        role:user.role,
        name:user.name,
        iat:moment().unix(),
        exp:moment().add(1, 'days').unix()
    }
    return jwt.encode(payload, secret);
}

// Función para crear un token de refresco, que se utiliza para obtener un nuevo token sin necesidad de volver a iniciar sesión
export function createRefreshToken(user) {
  const payload = {
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.encode(payload, secret);
}

// Función para crear un token específico para escáneres, con una duración de 10 años
export function createScannerToken() {
  const payload = {
    role: 'scanner',
    iat: moment().unix(),
    exp: moment().add(10, 'years').unix()
  };
  return jwt.encode(payload, secret);
}

export default {createToken, createRefreshToken, createScannerToken};

