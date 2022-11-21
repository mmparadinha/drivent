import { AuthenticatedRequest, handleApplicationErrors } from "@/middlewares";
import paymentsService, { TicketId } from "@/services/payments-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getPaymentByTicketId(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.query as unknown as TicketId;
  const { userId } = req;
  if (ticketId === undefined) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const ticketPaymentInfo = await paymentsService.getUserTicketPayment(ticketId, userId);
    return res.status(httpStatus.OK).send(ticketPaymentInfo);
  } catch (error) {
    return handleApplicationErrors(error, req, res);
  }
}

export async function postProcessPayment(req: AuthenticatedRequest, res: Response) {
  const { ticketId, cardData } = req.body;
  const { userId } = req;
  if (!ticketId || !cardData) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const processedPaymentConfirmation = await paymentsService.postProcessPayment(ticketId, cardData, userId);

    return res.status(httpStatus.OK).send(processedPaymentConfirmation);
  } catch (error) {
    return handleApplicationErrors(error, req, res);
  }
}
