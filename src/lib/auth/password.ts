import { compare, hash } from "bcryptjs";

const PASSWORD_HASH_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  if (password.length === 0) {
    throw new Error("Password cannot be empty.");
  }

  return hash(password, PASSWORD_HASH_ROUNDS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  if (password.length === 0 || passwordHash.length === 0) {
    return false;
  }

  return compare(password, passwordHash);
}
