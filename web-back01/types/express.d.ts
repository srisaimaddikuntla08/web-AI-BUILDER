import { Request } from "express";


declare global {
    namespace Express {
        interface Request {
            userId :string
        }
    }
}
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}