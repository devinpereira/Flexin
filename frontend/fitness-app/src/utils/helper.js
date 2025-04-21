export const validateEmail = (email) => {
  // Regular expression to validate email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};