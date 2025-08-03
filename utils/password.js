// Esquema de validación para contraseñas
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
export const PASSWORD_MESSAGE =
  'La contraseña debe tener al menos una letra mayúscula, un número y un carácter especial (!@#$%^&*).';
