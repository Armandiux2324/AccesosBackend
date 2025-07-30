import bcrypt from 'bcrypt';
import jwt from '../services/jwt.js';
import { User } from '../models/index.js';
import { Op } from 'sequelize';
import RefreshToken from '../models/RefreshToken.js';
import moment from 'moment';

export default {
    // Función para iniciar sesión
    async login(req, res) {
        // Validar que se envíen las credenciales
        const { identificator, password } = req.body;
        try {
            // Buscar al usuario por username o email
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

            // Validar la contraseña
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(400).send({ message: 'Credenciales inválidas' });
            }

            // Crear tokens JWT
            const accessToken = jwt.createToken(user);
            const refreshToken = jwt.createRefreshToken(user);

            // Guardar el refresh token en la base de datos
            await RefreshToken.create({
                token:      refreshToken,
                user_id:    user.id,
                expires_at: moment().add(7, 'days').toDate()
            });

            // Enviar la respuesta con los tokens y datos del usuario
            return res.status(200).send({
                message: 'Sesión iniciada correctamente',
                accessToken,
                refreshToken,
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

    // Función actualizar la contraseña del usuario
    async updatePassword(req, res) {
        const { id, newPass, confPass } = req.body;

        // Validar que el usuario tenga permisos para cambiar la contraseña
        if (!['Administrador', 'Directora'].includes(req.user.role)) {
            return res.status(403).send({ message: 'Acceso denegado' });
        }

        try {
            if (newPass !== confPass) {
                return res.status(400).send({ message: 'Las contraseñas no coinciden' });
            } else {
                // Hashear la nueva contraseña y actualizar el usuario
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

    // Función para agregar usuario 
    async save(req, res) {
        // Recibe los datos del usuario desde el cuerpo de la solicitud
        const { name, username, email, password, role } = req.body;

        // Validar que el usuario tenga permisos para crear usuarios
        if (!['Administrador', 'Directora'].includes(req.user.role)) {
            return res.status(403).send({ message: 'Acceso denegado' });
        }

        try {
            // Hashear la contraseña
            const hash = await bcrypt.hash(password, 10);
            await User.create({ name, username, email, password: hash, role });
            return res.status(201).send({ message: 'Usuario creado' });
        } catch (err) {
            return res.status(500).send({ message: 'Intenta más tarde' });
        }
    },


    // Función para actualizar un usuario
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

    // Función para eliminar un usuario
    async delete(req, res) {
        // Recibe el ID del usuario a eliminar desde la query
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

    // Función para obtener todos los usuarios
    async getAll(req, res) {
        try {
            // Obtener los parámetros de paginación
            const page = parseInt(req.query.page, 10) || 1;
            const size = parseInt(req.query.size, 10) || 20;
            const offset = (page - 1) * size;

            if (!['Administrador', 'Directora'].includes(req.user.role)) {
                return res.status(403).send({ message: 'Acceso denegado' });
            }

            // Consultar los usuarios excluyendo al usuario actual
            const result = await User.findAndCountAll({
                where: {
                    id: { [Op.ne]: req.user.sub }
                },
                attributes: { exclude: ['password'] },
                limit: size,
                offset: offset,
                order: [['name', 'ASC']]
            });

            // Enviar en la respuesta los datos de los usuarios, total, página actual, tamaño y total de páginas
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

    // Función para obtener un usuario por ID
    async getOne(req, res) {
        // Recibe el ID del usuario desde la query
        const { id } = req.query;
        try {
            let user;
            // Encontrar el usuario por ID y excluir la contraseña
            user = await User.findOne({
                where: { id: id },
                attributes: { exclude: ['password'] }
            });
            return res.status(200).send({ data: user });
        } catch (err) {
            return res.status(500).send({ message: 'Intenta más tarde' });
        }
    },

    // Función para buscar usuarios por nombre, nombre de usuario o email
    async searchUsers(req, res) {
        try {
            const { parameter, page = '1', size = '20' } = req.query;

            // Definir los parámetros de paginación
            const pageNum = parseInt(page, 10);
            const pageSize = parseInt(size, 10);
            const offset = (pageNum - 1) * pageSize;
            //Consulta de búsqueda y conteo de usuarios coincidentes
            const {count, rows} = await User.findAndCountAll({
                where: {
                    [Op.or]: [
                        { username: { [Op.like]: `%${parameter}%` } },
                        { email: { [Op.like]: `%${parameter}%` } },
                        { name: { [Op.like]: `%${parameter}%` } },
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

