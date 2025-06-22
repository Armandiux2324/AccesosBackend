import * as yup from 'yup';

export const capacitySchema = yup.object({
  id: yup.number().integer('ID inválido').positive('ID inválido').required('El ID es obligatorio'),
  capacity: yup.number().typeError('La capacidad debe ser un número').integer('La capacidad debe ser un entero').positive('La capacidad debe ser mayor que cero').required('La capacidad es obligatoria')
});