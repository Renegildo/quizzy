import { Response, Request, NextFunction } from 'express';
import { verify, TokenExpiredError, decode } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generateToken } from '../utils/jwt';
dotenv.config();

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  // TODO: User can be authenticated even if its account has been deleted. 

  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ msg: "Token not provided" });

  verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err && err instanceof TokenExpiredError) {
      console.log("getting newDecoded...")
      const newDecoded = decode(token);
      console.log("newDecoded: ", newDecoded);

      console.log("if: ", !newDecoded || typeof (newDecoded) === "string");
      if (!newDecoded || typeof (newDecoded) === "string") return res.status(401);

      console.log("getting refreshToken...")
      const refreshToken = req.headers["refresh-token"] as string;
      if (!refreshToken) {
        console.log("no refresh token this shit lol", refreshToken);
        return res.status(401);
      }
      console.log("refreshToken: ", refreshToken);
      const refreshTokenDecoded = verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
      if (!refreshTokenDecoded) return res.status(401);

      const newToken = generateToken({
        id: newDecoded.id,
        username: newDecoded.username,
      });

      return res.status(401).json({ msg: "Token expired", token: newToken });
    }

    if (err) return res.status(401).json({ msg: "Token invalid" });

    if (
      typeof (decoded) === "string" ||
      !decoded?.username ||
      !decoded?.id
    ) { return res.status(401).json({ msg: "Token is missing data" }); }

    req.user = {
      username: decoded.username,
      id: decoded.id,
    };

    console.log("next shit");
    next();
  });
}

