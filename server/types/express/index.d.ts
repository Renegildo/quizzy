import express from 'express';
import { IUser } from "./types"; 

export {};

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

