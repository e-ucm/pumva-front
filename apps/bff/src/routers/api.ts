import { Router } from "express";
import { Request, Response } from "express";
import config from '../config';

const router = Router();

router.get("/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello from BFF" });
});

router.get('/ssoconnect', (req: Request, res: Response, next: any) => {
  
});

export default router;