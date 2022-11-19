import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { postProcessPayment, getPaymentByTicketId } from "@/controllers";
import { createEnrollmentSchema } from "@/schemas";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getPaymentByTicketId)
  .post("/", validateBody(), postProcessPayment);

export { paymentsRouter };
