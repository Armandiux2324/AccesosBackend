import * as yup from 'yup';

export const createPaymentSchema = yup.object({
  total: yup.number().typeError('El total debe ser un número').required('El total es obligatorio').positive('El total debe ser positivo'),
  cash: yup.number().typeError('El efectivo debe ser un número').required('El efectivo es obligatorio').min(0, 'El efectivo debe ser positivo'),
  card: yup.number().typeError('La tarjeta debe ser un número').required('La tarjeta es obligatoria').min(0, 'La tarjeta debe ser positiva'),
  payment_check: yup.number().typeError('El cheque debe ser un número').required('El cheque es obligatorio').min(0, 'El cheque debe ser positivo')
});

export const paymentIdSchema = yup.object({
  id: yup.number().integer('ID inválido').positive('ID inválido').required('El ID del pago es obligatorio')
});
