import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { postProcessPayment, getPaymentByTicketId } from "@/controllers";
import { createPaymentSchema } from "@/schemas/payment-schemas";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getPaymentByTicketId)
  .post("/process", validateBody(createPaymentSchema), postProcessPayment);

export { paymentsRouter };
