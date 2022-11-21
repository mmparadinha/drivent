import { PostPayment } from "@/services/payments-service";
import Joi from "joi";

export const createPaymentSchema = Joi.object<PostPayment>({
  ticketId: Joi.number().required(),
  cardData: {
    issuer: Joi.string().required(),
    number: Joi.number().required(),
    name: Joi.string().required(),
    expirationDate: Joi.date().required(),
    cvv: Joi.number().required()
  }
});
