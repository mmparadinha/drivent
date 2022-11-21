import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { postProcessPayment, getPaymentByTicketId } from "@/controllers";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getPaymentByTicketId)
  .post("/process", /* validateBody(), */ postProcessPayment);

export { paymentsRouter };
