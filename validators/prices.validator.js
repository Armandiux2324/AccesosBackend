import * as yup from 'yup';

export const createPriceSchema = yup.object({
  type: yup.string().required('El tipo de precio es obligatorio'),
  price: yup.number().typeError('El precio debe ser un número').positive('El precio debe ser mayor que cero').required('El precio es obligatorio')
});

export const updatePricesSchema = yup.object({
  updates: yup
    .array().of(yup.object({
        id: yup.number().positive('ID inválido').required('El ID es obligatorio'),
        price: yup.number().typeError('El precio debe ser un número').required('El precio es obligatorio')
      })
    ).min(1, 'Se debe enviar al menos una actualización').required('Lista de actualizaciones obligatoria')
});

export const idPriceSchema = yup.object({
  id: yup.number().integer('ID inválido').positive('ID inválido').required('El ID del precio es obligatorio')
});
