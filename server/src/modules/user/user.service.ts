import bcrypt from "bcrypt";
import { ApiError } from "../../shared/errors/ApiError";
import { signToken } from "../../shared/utils/jwt";
import { createUser, findUserByEmail } from "./user.repository";
import { RegisterDTO } from "./user.types";

const SALT_ROUNDS = 10;

export const registerUser = async (data: RegisterDTO) => {
  const existingUser = await findUserByEmail(data.email);
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  return createUser({
    email: data.email,
    password: hashedPassword
  });
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new ApiError(401, "Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  return signToken({ userId: user.id });
};
