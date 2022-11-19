import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getTickets, postCreateTicket, getTicketsTypes } from "@/controllers";
import { createTicketSchema } from "@/schemas/ticket-schemas";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketsTypes)
  .get("/", getTickets)
  .post("/", validateBody(createTicketSchema), postCreateTicket);

export { ticketsRouter };
