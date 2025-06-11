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
        const { id, password } = req.body;

        if (!['Administrador', 'Directora'].includes(req.user.role)) {
            return res.status(403).send({ message: 'Acceso denegado' });
        }
        if (!id || !password) {
            return res.status(400).send({ message: 'Todos los campos son obligatorios' });
        }

        try {
            const hash = await bcrypt.hash(password, 10);
            const [updated] = await User.update(
                { password: hash },
                { where: { id } }
            );
            if (!updated) {
                return res.status(404).send({ message: 'Usuario no encontrado' });
            }
            return res.status(200).send({ message: 'Contraseña cambiada' });
        } catch (err) {
            return res.status(500).send({ message: 'Intenta más tarde' });
        }
    },

    async save(req, res) {
        console.log(req)
        const { name, username, email, password, role } = req.body;

        if (!['Administrador', 'Directora'].includes(req.user.role)) {
            return res.status(403).send({ message: 'Acceso denegado' });
        }
        if (!name || !username || !email || !password || !role) {
            return res.status(400).send({ message: 'Todos los campos son obligatorios' });
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
        if (!id || !name || !username || !email || !role) {
            return res.status(400).send({ message: 'Todos los campos son obligatorios' });
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
        const { id } = req.body;

        if (!['Administrador', 'Directora'].includes(req.user.role)) {
            return res.status(403).send({ message: 'Acceso denegado' });
        }
        if (!id) {
            return res.status(400).send({ message: 'Falta el ID del usuario' });
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
            let users;
            if (['Administrador', 'Directora'].includes(req.user.role)) {
                users = await User.findAll();
            } else {
                users = await User.findAll({ where: { id: req.user.id } });
            }
            return res.status(200).send({ data: users });
        } catch (err) {
            return res.status(500).send({ message: 'Intenta más tarde' });
        }
    },

    async getOne(req, res) {
        try {
            let user;
            user = await User.findOne({ where: { id: req.body.id } });
            return res.status(200).send({ data: user });
        } catch (err) {
            return res.status(500).send({ message: 'Intenta más tarde' });
        }
    }
} 

