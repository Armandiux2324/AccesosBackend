import * as yup from 'yup';
import { PASSWORD_REGEX, PASSWORD_MESSAGE } from '../utils/password.js';

export const loginSchema = yup.object({
  identificator: yup.string().required('El identificador es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria')
});

export const passwordSchema = yup.object({
  id: yup.number().integer('ID inválido').positive('ID inválido').required('El ID es obligatorio'),
  newPass: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').matches(PASSWORD_REGEX, PASSWORD_MESSAGE).required('La contraseña es obligatoria'),
  confPass: yup.string().oneOf([yup.ref('newPass')], 'Las contraseñas no coinciden').required('La confirmación de contraseña es obligatoria'),
});

export const createSchema = yup.object({
  name: yup.string().required('El nombre es obligatorio'),
  username: yup.string().required('El nombre de usuario es obligatorio'),
  email: yup.string().email('Email inválido').required('El correo es obligatorio'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').matches(PASSWORD_REGEX, PASSWORD_MESSAGE).required('La contraseña es obligatoria'),
  role: yup.string().oneOf(['Administrador', 'Directora', 'Taquilla'], 'Rol inválido').required('El rol es obligatorio')
});

export const updateSchema = yup.object({
  id: yup.number().integer('ID inválido').positive('ID inválido').required('El ID es obligatorio'),
  name: yup.string().required('El nombre es obligatorio'),
  username: yup.string().required('El nombre de usuario es obligatorio'),
  email: yup.string().email('Email inválido').required('El correo es obligatorio'),
  role: yup.string().oneOf(['Administrador', 'Directora', 'Taquilla'], 'Rol inválido').required('El rol es obligatorio')
});

export const userIdSchema = yup.object({
  id: yup.number().integer('ID inválido').positive('ID inválido').required('El ID es obligatorio')
});

export const refreshSchema = yup.object({
  refreshToken: yup.string().required('Se requiere refreshToken')
});

export const logoutSchema = yup.object({
  refreshToken: yup.string().required('Se requiere refreshToken')
});
