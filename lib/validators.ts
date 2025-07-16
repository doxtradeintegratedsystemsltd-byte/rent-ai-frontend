export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone: string): boolean =>
  /^(\+234|0)[789][01]\d{8}$/.test(phone); // Nigerian format

export const isStrongPassword = (password: string): boolean =>
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(password);
