import bcrypt from "bcryptjs";

const DEFAULT_SALT_ROUNDS = 12;

const saltRounds = Number.parseInt(
  process.env.AUTH_BCRYPT_SALT_ROUNDS ?? `${DEFAULT_SALT_ROUNDS}`,
  10
);

export async function hashPassword(password: string) {
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
