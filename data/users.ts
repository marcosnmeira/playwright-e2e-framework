import { env } from '../config/env';

export type UserCredentials = {
  email: string;
  password: string;
};

export type UserRegistration = UserCredentials & {
  firstName: string;
  lastName: string;
};

export const defaultUser: UserCredentials = {
  email: env.defaultUserEmail,
  password: env.defaultUserPassword,
};

export const invalidLoginAttempts: UserCredentials[] = [
  {
    email: 'qa@example.com',
    password: 'senha-incorreta',
  },
  {
    email: 'unknown@example.com',
    password: 'Secret123!',
  },
];

export const registrationUsers: UserRegistration[] = [
  {
    firstName: 'Marina',
    lastName: 'Silva',
    email: 'marina.silva@example.com',
    password: 'Secure123!',
  },
  {
    firstName: 'Caio',
    lastName: 'Pereira',
    email: 'caio.pereira@example.com',
    password: 'Secure123!',
  },
];
