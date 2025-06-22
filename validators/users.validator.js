import * as yup from 'yup';

export const loginSchema = yup.object({
  identificator: yup.string().required('El identificador es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria')
});

export const passwordSchema = yup.object({
  id: yup.number().integer('ID inválido').positive('ID inválido').required('El ID es obligatorio'),
  newPass: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria')
});

export const createSchema = yup.object({
  name: yup.string().required('El nombre es obligatorio'),
  username: yup.string().required('El nombre de usuario es obligatorio'),
  email: yup.string().email('Email inválido').required('El correo es obligatorio'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
  role: yup.string().oneOf(['Administrador', 'Directora', 'Taquilla'], 'Rol inválido').required('El rol es obligatorio')
});

export const updateSchema = yup.object({
  id: yup.number().integer('ID inválido').positive('ID inválido').required('El ID es obligatorio'),
  name: yup.string().required('El nombre es obligatorio'),
  username: yup.string().required('El nombre de usuario es obligatorio'),
  email: yup.string().email('Email inválido').required('El correo es obligatorio'),
  role: yup.string().oneOf(['Administrador', 'Directora', 'Taquilla'], 'Rol inválido').required('El rol es obligatorio')
});

export const deleteSchema = yup.object({
  id: yup.number().integer('ID inválido').positive('ID inválido').required('El ID es obligatorio')
});
