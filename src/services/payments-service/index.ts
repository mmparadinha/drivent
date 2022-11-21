import { notFoundError, unauthorizedError } from "@/errors";
import { cardData } from "@/protocols";
import paymentRepository from "@/repositories/payment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function isUserEnrolled(userId: number) {
  const userEnrollment = await ticketRepository.findUserEnrollmentId(userId);
  if (!userEnrollment) throw notFoundError();

  return userEnrollment;
}

async function getUserTicketPayment(ticketId: number, userId: number) {
  const userEnrollmentInfo = await isUserEnrolled(userId);
  const acessedTicket = await paymentRepository.findAcessedTicket(ticketId);
  if (!acessedTicket) throw notFoundError();
  if (userEnrollmentInfo.id !== acessedTicket.enrollmentId) throw unauthorizedError();

  const ticketPayment = await paymentRepository.findTicketPayment(acessedTicket.id);

  return ticketPayment;
}

async function postProcessPayment(ticketId: number, cardData: cardData, userId: number) {
  const userEnrollmentInfo = await isUserEnrolled(userId);
  const acessedTicket = await paymentRepository.findAcessedTicket(ticketId);
  if (!acessedTicket) throw notFoundError();
  if (userEnrollmentInfo.id !== acessedTicket.enrollmentId) throw unauthorizedError();

  const ticketType = await paymentRepository.findTicketPrice(acessedTicket.ticketTypeId);

  const newPayment = {
    ticketId,
    value: ticketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: String(cardData.number).slice(11)
  };
  const paymentInfo = await paymentRepository.postPayment(newPayment);
  await paymentRepository.updateTicketStatus(ticketId);

  return paymentInfo;
}

export type TicketId = {
  ticketId: number
};

const paymentsService = {
  getUserTicketPayment,
  postProcessPayment
};

export default paymentsService;
