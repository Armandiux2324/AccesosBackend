import * as yup from 'yup';

export const createVisitorSchema = yup.object({
  age: yup.number().typeError('La edad debe ser un número').integer('La edad debe ser un entero').min(0, ' La edad no puede ser negativa').required('La edad es obligatoria'),
  gender: yup.string().required('El género es obligatorio'),
  township: yup.string().required('El municipio es obligatorio'),
  price_id: yup.number().positive('ID del precio inválido').required('ID del precio es obligatorio'),
  visit_id: yup.number().positive('ID de la visita inválida').required('ID de la visita es obligatorio')
});

export const updateVisitorSchema = yup.object({
  id: yup.number().positive('ID inválido').required('El campo ID es obligatorio'),
  age: yup.number().typeError('La edad debe ser un número').integer('La edad debe ser un entero').min(0, ' La edad no puede ser negativa').required('La edad es obligatoria'),
  gender: yup.string().required('El género es obligatorio'),
  township: yup.string().required('El municipio es obligatorio'),
  price_id: yup.number().positive('ID del precio inválido').required('ID del precio es obligatorio'),
  visit_id: yup.number().positive('ID de la visita inválida').required('ID de la visita es obligatorio')
});

export const idVisitorSchema = yup.object({
  id: yup.number().positive('ID inválido').required('El campo ID es obligatorio')
});

export const dateRangeSchema = yup.object({
  from: yup.date().typeError('Fecha de inicio inválida').required('La fecha de inicio es obligatoria'),
  to: yup.date().typeError('Fecha final inválida').required('La fecha final es obligatoria')
});
