import jwt from 'jwt-simple';
import moment from 'moment';
import jwtService from '../services/jwt.js';
import RefreshToken from '../models/RefreshToken.js';

const SECRET = process.env.JWT_SECRET;

export default {
    async refreshToken(req, res) {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).send({ message: 'Falta refreshToken' });
        }

        // 1) Verificar que esté en BD
        const stored = await RefreshToken.findOne({ where: { token: refreshToken } });
        if (!stored) {
            return res.status(403).send({ message: 'Refresh token inválido' });
        }

        // 2) Decodificar y comprobar expiración
        let payload;
        try {
            payload = jwt.decode(refreshToken, SECRET);
        } catch (err) {
            // token malformado: eliminar y rechazar
            await stored.destroy();
            return res.status(403).send({ message: 'Refresh token malformado' });
        }
        if (payload.exp <= moment().unix()) {
            await stored.destroy();
            return res.status(404).send({ message: 'Refresh token expirado' });
        }

        // 3) Generar nuevo access token
        const user = { id: payload.sub };
        const newAccessToken = jwtService.createToken(user);

        return res.status(200).json({ accessToken: newAccessToken });
    },

    async logout(req, res) {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await RefreshToken.destroy({ where: { token: refreshToken } });
        }
        return res.status(200).send({ message: 'Logout OK' });
    }
}
