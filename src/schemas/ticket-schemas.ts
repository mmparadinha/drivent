import { TicketTypeId } from "@/services/tickets-service";
import Joi from "joi";

export const createTicketSchema = Joi.object<TicketTypeId>({
  ticketTypeId: Joi.number().required()
});
