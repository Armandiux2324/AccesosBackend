import * as yup from 'yup';

export const createVisitorSchema = yup.object({
  age: yup.number().typeError('La edad debe ser un número').integer('La edad debe ser un entero').min(0, ' La edad no puede ser negativa').required('La edad es obligatoria'),
  gender: yup.string().required('El género es obligatorio'),
  township: yup.string().required('El municipio es obligatorio'),
  unit_price: yup.number().typeError('El precio unitario debe ser un número').min(0, 'El precio unitario no puede ser negativo').required('El precio unitario es obligatorio'),
  visit_id: yup.number().positive('ID de la visita inválida').required('ID de la visita es obligatorio')
});

export const updateVisitorSchema = yup.object({
  id: yup.number().positive('ID inválido').required('El campo ID es obligatorio'),
  age: yup.number().typeError('La edad debe ser un número').integer('La edad debe ser un entero').min(0, ' La edad no puede ser negativa').required('La edad es obligatoria'),
  gender: yup.string().required('El género es obligatorio'),
  township: yup.string().required('El municipio es obligatorio'),
  unit_price: yup.number().typeError('El precio unitario debe ser un número').min(0, 'El precio unitario no puede ser negativo').required('El precio unitario es obligatorio'),
  visit_id: yup.number().positive('ID de la visita inválida').required('ID de la visita es obligatorio')
});

export const idVisitorSchema = yup.object({
  id: yup.number().positive('ID inválido').required('El campo ID es obligatorio')
});
