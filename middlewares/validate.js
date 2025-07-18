import { ValidationError } from 'yup';

// Middleware para validar datos usando Yup
export function validateAll(schema, source = 'body') {
  return async (req, res, next) => {
    try {
      const data = req[source]; // body, query o params
      await schema.validate(data, { abortEarly: false });
      next();
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ errors: err.errors });
      }
      next(err);
    }
  };
}
