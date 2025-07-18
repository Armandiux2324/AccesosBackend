import jwt from 'jwt-simple';
import moment from 'moment';
import jwtService from '../services/jwt.js';
import RefreshToken from '../models/RefreshToken.js';

// Clave para firmar los tokens
const SECRET = process.env.JWT_SECRET;

export default {
    //Función para refrescar el token de acceso. Recibe el request con el refreshToken en el body
    async refreshToken(req, res) {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).send({ message: 'Falta refreshToken' });
        }

        // Verificar que el token esté en la BD
        const stored = await RefreshToken.findOne({ where: { token: refreshToken } });
        if (!stored) {
            return res.status(403).send({ message: 'Refresh token inválido' });
        }

        // Decodificar token y comprobar expiración del mismo
        let payload;
        try {
            payload = jwt.decode(refreshToken, SECRET);
        } catch (err) {
            // Para un token malformado se elimina y rechaza la solicitud
            await stored.destroy();
            return res.status(403).send({ message: 'Refresh token malformado' });
        }
        if (payload.exp <= moment().unix()) {
            await stored.destroy();
            return res.status(404).send({ message: 'Refresh token expirado' });
        }

        // Generación de nuevo access token
        const user = { id: payload.sub };
        const newAccessToken = jwtService.createToken(user);

        return res.status(200).json({ accessToken: newAccessToken });
    },
    
    //Función para cerrar sesión y eliminar el refresh token
    async logout(req, res) {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await RefreshToken.destroy({ where: { token: refreshToken } });
        }
        return res.status(200).send({ message: 'Logout OK' });
    }
}
