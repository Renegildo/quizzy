import { Response, Request, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  // TODO: User can be authenticated even if its account has been deleted. 

  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ msg: "Token not provided" });

  verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Token invalid" });

    if (
      typeof decoded === "string" ||
      !decoded?.username ||
      !decoded?.id
    ) { return res.status(401).json({ msg: "Token is missing data" }); }

    req.user = {
      username: decoded.username,
      id: decoded.id,
    };

    next();
  });
}

