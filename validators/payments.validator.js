import * as yup from 'yup';

export const createPaymentSchema = yup.object({
  payment_type: yup.string().required('El tipo de pago es obligatorio')
});

export const updatePaymentSchema = yup.object({
  id: yup.number().integer('ID inválido').positive('ID inválido').required('El ID del pago es obligatorio'),
  payment_type: yup.string().required('El tipo de pago es obligatorio')
});

export const deletePaymentSchema = yup.object({
  id: yup.number().integer('ID inválido').positive('ID inválido').required('El ID del pago es obligatorio')
});

export const getOnePaymentSchema = deletePaymentSchema;
