import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const comparePasswords = (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};

export const hashPassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, 5);
};

export const signToken = (id: number): string => {
    const secret = process.env.JWT_SECRET as string;

    return jwt.sign({ id: id }, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
};