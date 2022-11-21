import { notFoundError, unauthorizedError } from "@/errors";
import { cardData } from "@/protocols";
import paymentRepository from "@/repositories/payment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Enrollment, Payment } from "@prisma/client";

async function isUserEnrolled(userId: number): Promise<Enrollment> {
  const userEnrollment = await ticketRepository.findUserEnrollmentId(userId);
  if (!userEnrollment) throw notFoundError();

  return userEnrollment;
}

async function getUserTicketPayment(ticketId: number, userId: number): Promise<Payment> {
  const userEnrollmentInfo = await isUserEnrolled(userId);
  const acessedTicket = await paymentRepository.findAcessedTicket(ticketId);
  if (!acessedTicket) throw notFoundError();
  if (userEnrollmentInfo.id !== acessedTicket.enrollmentId) throw unauthorizedError();

  const ticketPayment = await paymentRepository.findTicketPayment(acessedTicket.id);

  return ticketPayment;
}

async function postProcessPayment(ticketId: number, cardData: cardData, userId: number): Promise<Payment> {
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

export type PostPayment = {
  ticketId: number,
	cardData: {
		issuer: string,
    number: number,
    name: string,
    expirationDate: Date,
    cvv: number
	}
};

const paymentsService = {
  getUserTicketPayment,
  postProcessPayment
};

export default paymentsService;
