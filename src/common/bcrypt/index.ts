import * as bcrypt from 'bcrypt';

export const convertToHash = (password: string): Promise<string> => {
  if (!password) return;
  return bcrypt.hash(password, 8);
};

export const compareHash = (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
