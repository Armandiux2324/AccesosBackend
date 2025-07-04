import bcrypt from 'bcrypt';
import jwt from '../services/jwt.js';
import { User } from '../models/index.js';
import { Op } from 'sequelize';

export default {

    async login(req, res) {
        const { identificator, password } = req.body;
        try {
            const user = await User.findOne({
                where: {
                    [Op.or]: [
                        { username: identificator },
                        { email: identificator }
                    ]
                }
            });
            if (!user) {
                return res.status(400).send({ message: 'Credenciales inválidas' });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(400).send({ message: 'Credenciales inválidas' });
            }
            const token = jwt.createToken(user);
            return res.status(200).send({
                message: 'Sesión iniciada correctamente',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    role: user.role
                }
            });
        } catch (err) {
            return res.status(500).send({ message: 'Intenta más tarde' });
        }
    },

    async updatePassword(req, res) {
        const { id, newPass, confPass } = req.body;

        if (!['Administrador', 'Directora'].includes(req.user.role)) {
            return res.status(403).send({ message: 'Acceso denegado' });
        }

        try {
            if (newPass !== confPass) {
                return res.status(400).send({ message: 'Las contraseñas no coinciden' });
            } else {
                const hash = await bcrypt.hash(newPass, 10);
                const [updated] = await User.update(
                    { password: hash },
                    { where: { id } }
                );
                if (!updated) {
                    return res.status(404).send({ message: 'Usuario no encontrado' });
                }
                return res.status(200).send({ message: 'Contraseña cambiada' });
            }
        } catch (err) {
            return res.status(500).send({ message: 'Intenta más tarde' });
        }
    },

    async save(req, res) {
        const { name, username, email, password, role } = req.body;

        if (!['Administrador', 'Directora'].includes(req.user.role)) {
            return res.status(403).send({ message: 'Acceso denegado' });
        }

        try {
            const hash = await bcrypt.hash(password, 10);
            await User.create({ name, username, email, password: hash, role });
            return res.status(201).send({ message: 'Usuario creado' });
        } catch (err) {
            return res.status(500).send({ message: 'Intenta más tarde' });
        }
    },

    async update(req, res) {
        const { id, name, username, email, role } = req.body;

        if (!['Administrador', 'Directora'].includes(req.user.role)) {
            return res.status(403).send({ message: 'Acceso denegado' });
        }

        try {
            const [updated] = await User.update(
                { name, username, email, role },
                { where: { id } }
            );
            if (!updated) {
                return res.status(404).send({ message: 'Usuario no encontrado' });
            }
            return res.status(200).send({ message: 'Usuario actualizado' });
        } catch (err) {
            return res.status(500).send({ message: 'Intenta más tarde' });
        }
    },

    async delete(req, res) {
        const { id } = req.query;

        if (!['Administrador', 'Directora'].includes(req.user.role)) {
            return res.status(403).send({ message: 'Acceso denegado' });
        }

        try {
            const deleted = await User.destroy({ where: { id } });
            if (!deleted) {
                return res.status(404).send({ message: 'Usuario no encontrado' });
            }
            return res.status(200).send({ message: 'Usuario eliminado' });
        } catch (err) {
            return res.status(500).send({ message: 'Intenta más tarde' });
        }
    },

    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const size = parseInt(req.query.size, 10) || 20;
            const offset = (page - 1) * size;

            if (!['Administrador', 'Directora'].includes(req.user.role)) {
                return res.status(403).send({ message: 'Acceso denegado' });
            }

            const result = await User.findAndCountAll({
                where: {
                    id: { [Op.ne]: req.user.sub }
                },
                attributes: { exclude: ['password'] },
                limit: size,
                offset: offset,
                order: [['name', 'ASC']]
            });

            return res.status(200).send({
                data: result.rows,
                total: result.count,
                page,
                size,
                totalPages: Math.ceil(result.count / size)
            });
        } catch (err) {
            return res.status(500).send({ message: 'Intenta más tarde' });
        }
    },

    async getOne(req, res) {
        try {
            let user;
            user = await User.findOne({
                where: { id: req.query.id },
                attributes: { exclude: ['password'] }
            });
            return res.status(200).send({ data: user });
        } catch (err) {
            return res.status(500).send({ message: 'Intenta más tarde' });
        }
    },

    async search(req, res) {
        try {
            const { parameter, page = '1', size = '20' } = req.query;

            const pageNum = parseInt(page, 10);
            const pageSize = parseInt(size, 10);
            const offset = (pageNum - 1) * pageSize;
            const {count, rows} = await User.findAndCountAll({
                where: {
                    [Op.or]: [
                        { username: { [Op.like]: `%${parameter}%` } },
                        { email: { [Op.like]: `%${parameter}%` } }
                    ],
                    id: { [Op.ne]: req.user.sub }
                },
                attributes: { exclude: ['password'] },
                order: [['name', 'ASC']],
                limit:  pageSize,
                offset: offset
            });
            return res.status(200).send({
                data:       rows,
                total:      count,
                page:       pageNum,
                size:       pageSize,
                totalPages: Math.ceil(count / pageSize)
            });
        } catch (err) {
            return res.status(500).send({ message: 'Intenta más tarde' });
        }
    },
}

