import * as yup from 'yup';

export const updatePricesSchema = yup.object({
  updates: yup.array().of(yup.object({
    id: yup.number().positive('ID inválido').required('El ID es obligatorio'),
    price: yup.number().typeError('El precio debe ser un número').required('El precio es obligatorio')})).min(1, 'Se debe enviar al menos una actualización').required('Lista de actualizaciones obligatoria')
});