export const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      return next();
    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }
  };
};
