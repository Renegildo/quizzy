import jwt from 'jsonwebtoken';

export const generateToken = (payload: any) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    { expiresIn: 60 * 5 },
  );
}

export const generateRefreshToken = (payload: any) => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: 60 * 60 * 24 * 7 },
  );
}

