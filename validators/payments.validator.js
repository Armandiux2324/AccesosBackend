import * as yup from 'yup';

export const createPaymentSchema = yup.object({
  payment_type: yup.string().required('El tipo de pago es obligatorio'),
  payment_date: yup.date().typeError('Fecha inválida').required('La fecha del pago es obligatoria')
});

export const updatePaymentSchema = yup.object({
  id: yup.number().integer('ID inválido').positive('ID inválido').required('El ID del pago es obligatorio'),
  payment_type: yup.string().required('El tipo de pago es obligatorio'),
  payment_date: yup.date().typeError('Fecha inválida').required('La fecha del pago es obligatoria')
});

export const deletePaymentSchema = yup.object({
  id: yup.number().integer('ID inválido').positive('ID inválido').required('El ID del pago es obligatorio')
});

export const getPaymentByDateSchema = yup.object({
  parameter: yup.date().typeError('Fecha inválida').required('Parámetro de búsqueda obligatorio')
});

export const getOnePaymentSchema = deletePaymentSchema;
