import * as yup from 'yup';

export const settingsSchema = yup.object({
  id: yup.number().integer('ID inválido').positive('ID inválido').required('El ID es obligatorio'),
  capacity: yup.number().typeError('Capacidad inválida').integer('Capacidad inválida').positive('Capacidad inválida').required('La capacidad es obligatoria'),
  companion_discount: yup.number().typeError('Descuento inválido').min(0, 'El descuento no puede ser negativo').required('El descuento de acompañante es obligatorio'),
});