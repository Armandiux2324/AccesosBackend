import jwt from 'jwt-simple';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_SECRET;

// Middleware de autenticación
export function Auth(req, res, next) {
  // Verificar si el token está presente en los headers
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).send({ message: 'Falta llave' });
  }

  // Verificar si el token es válido
  const token = authHeader.replace(/['"]+/g, '');
  try {
    // Decodificar el token y verificar su expiración
    const payload = jwt.decode(token, secret);
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({ message: 'Sesión expirada.' });
    }

    if (payload.role == 'scanner') {
      req.user = payload;
      return next();
    }

    // Para cualquier otro endpoint, sólo usuarios con role distinto de 'scanner'
    if (payload.role !== 'scanner') {
      req.user = payload;
      return next();
    }
  } catch (err) {
    return res.status(401).send({ message: 'Sesión inválida.' });
  }
}

