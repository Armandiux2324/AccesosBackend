import * as yup from 'yup';

export const createTicketSchema = yup.object({
  visit_id: yup.number().required('El campo visit_id es obligatorio'),
  payment_id: yup.number().required('El campo payment_id es obligatorio'),
});

export const updateTicketSchema = yup.object({
  id: yup.number().positive('id inválido').required('El campo id es obligatorio'),
  visit_id: yup.number().positive('ID de la visita inválido').required('El campo visit_id es obligatorio'),
  payment_id: yup.number().positive('payment_id inválido').required('El campo payment_id es obligatorio'),
});

export const updateStatusSchema = yup.object({
  id: yup.number().positive('ID inválido').required('El campo ID es obligatorio'),
  status: yup.string().oneOf(['Activo', 'Inactivo', 'Sin iniciar'], 'Estado inválido').required('El estado es obligatorio')
});

export const scanTicketSchema = yup.object({
  ticket_id: yup.string().required('El ID del ticket es obligatorio'),
}); 
