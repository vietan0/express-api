import bcrypt from 'bcrypt';
export function comparePasswords(
  plainPassword: string,
  hashedPasswordInDb: string
) {
  return bcrypt.compare(plainPassword, hashedPasswordInDb);
}

export function hashPassword(plainPassword: string) {
  return bcrypt.hash(plainPassword, 5);
}
