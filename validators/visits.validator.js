import * as yup from 'yup';

export const createVisitSchema = yup.object({
  contact: yup.string().required('El contacto es obligatorio'),
});

export const updateVisitSchema = yup.object({
  id: yup.number().positive('ID inválido').required('El campo ID es obligatorio'),
  contact: yup.string().required('El campo contact es obligatorio'),
  duration_minutes: yup.number().typeError('La duración debe ser un número').integer('La duración debe ser un entero').min(0, 'La duración no puede ser negativa').required('La duración es obligatoria')
});

