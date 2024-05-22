import { Request } from "express";

export interface IUser {
  id: string;
  username: string;
}

export interface IAuthRequest extends Request {
  user: IUser;  
}
