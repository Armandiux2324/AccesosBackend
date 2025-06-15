import * as yup from 'yup';

export const createTicketSchema = yup.object({
  visit_id: yup.number().required('El campo es obligatorio'),
  payment_id: yup.number().required('El campo payment_id es obligatorio'),
  total: yup.number().typeError('El total debe ser un número').min(0, 'total no puede ser negativo').required('El campo total es obligatorio')
});

export const updateTicketSchema = yup.object({
  id: yup.number().positive('id inválido').required('El campo id es obligatorio'),
  visit_id: yup.number().positive('ID de la visita inválido').required('El campo visit_id es obligatorio'),
  payment_id: yup.number().positive('payment_id inválido').required('El campo payment_id es obligatorio'),
  total: yup.number().typeError('El total debe ser un número').min(0, 'total no puede ser negativo').required('El campo total es obligatorio')
});

export const idTicketSchema = yup.object({
  id: yup.number().positive('ID inválido').required('El campo id es obligatorio')
});
