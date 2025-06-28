import * as yup from 'yup';

export const createVisitSchema = yup.object({
  contact: yup.string().required('El contacto es obligatorio'),
  datetime_begin: yup.date().typeError('Fecha y hora de inicio inválida').required('La fecha y hora de inicio es obligatoria')
});

export const updateDatetimeEndSchema = yup.object({
  id: yup.number().positive('ID inválido').required('El ID es obligatorio'),
  datetime_end: yup.date().typeError('Fecha y hora de fin inválida').required('La fecha y hora de fin es obligatoria')
});

export const updateVisitSchema = yup.object({
  id: yup.number().positive('ID inválido').required('El campo ID es obligatorio'),
  contact: yup.string().required('El campo contact es obligatorio'),
  datetime_begin: yup.date().typeError('Fecha y hora de inicio inválida').required('La fecha y hora de inicio es obligatoria'),
  datetime_end: yup.date().typeError('Fecha y hora de fin inválida').required('La fecha y hora de fin es obligatoria'),
  duration_minutes: yup.number().typeError('La duración debe ser un número').integer('La duración debe ser un entero').min(0, 'La duración no puede ser negativa').required('La duración es obligatoria')
});

