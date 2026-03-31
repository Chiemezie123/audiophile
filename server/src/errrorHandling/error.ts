import { Request, Response, NextFunction } from "express";


export const catchAsync = (fn) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => next(err));
  };
};

export class AllError extends Error {
  statusCode?: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode?: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "failed" : "error";
    this.isOperational = true;
  }
}
