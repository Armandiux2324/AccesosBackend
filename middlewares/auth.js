import jwt from 'jwt-simple';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_SECRET;

export function Auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).send({ message: 'Falta llave' });
  }

  const token = authHeader.replace(/['"]+/g, '');
  try {
    const payload = jwt.decode(token, secret);
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({ message: 'Sesión expirada.' });
    }

    if (payload.role == 'scanner' && req.path == '/tickets/scan') {
      req.user = payload;
      return next();
    }

    // Para cualquier otro endpoint, sólo usuarios con role distinto de 'scanner'
    if (payload.role && payload.role !== 'scanner') {
      req.user = payload;
      return next();
    }
  } catch (err) {
    return res.status(401).send({ message: 'Sesión inválida.' });
  }
}

