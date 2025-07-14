import * as yup from 'yup';

export const createPaymentSchema = yup.object({
  payment_type: yup.string().required('El tipo de pago es obligatorio'),
  total: yup.number().typeError('El total debe ser un número').required('El total es obligatorio').positive('El total debe ser positivo')
});

export const updatePaymentSchema = yup.object({
  id: yup.number().integer('ID inválido').positive('ID inválido').required('El ID del pago es obligatorio'),
  payment_type: yup.string().required('El tipo de pago es obligatorio'),
  total: yup.number().typeError('El total debe ser un número').required('El total es obligatorio').positive('El total debe ser positivo')
});

export const deletePaymentSchema = yup.object({
  id: yup.number().integer('ID inválido').positive('ID inválido').required('El ID del pago es obligatorio')
});

export const getPaymentByDateSchema = yup.object({
  parameter: yup.date().typeError('Fecha inválida').required('Parámetro de búsqueda obligatorio')
});

export const getOnePaymentSchema = deletePaymentSchema;
