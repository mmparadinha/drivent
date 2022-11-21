import { notFoundError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import { TicketStatus, TicketType, Enrollment, Ticket } from "@prisma/client";

async function getAllTicketTypes(): Promise<TicketType[]> {
  const ticketTypes = await ticketRepository.findAllTicketTypes();
  if (!ticketTypes) throw notFoundError();

  return ticketTypes;
}

async function isUserEnrolled(userId: number): Promise<Enrollment> {
  const userEnrollment = await ticketRepository.findUserEnrollmentId(userId);
  if (!userEnrollment) throw notFoundError();

  return userEnrollment;
}

async function getTickets(userId: number): Promise<Ticket & {TicketType: TicketType;}> {
  const userEnrollmentInfo = await isUserEnrolled(userId);

  const userTickets = await ticketRepository.findAllUserTickets(userEnrollmentInfo.id);
  if (!userTickets) throw notFoundError();

  return userTickets;
}

async function createTicket(ticketTypeId: number, userId: number): Promise<Ticket & {TicketType: TicketType;}> {
  const userEnrollmentInfo = await isUserEnrolled(userId);

  const newTicket = {
    ticketTypeId,
    enrollmentId: userEnrollmentInfo.id,
    status: TicketStatus.RESERVED
  };
  const ticketTypeInfo = await ticketRepository.findTicketType(ticketTypeId);
  const newTicketInfo = await ticketRepository.createNewTicket(newTicket);
  
  return {
    ...newTicketInfo,
    TicketType: ticketTypeInfo
  };
}

export type TicketTypeId = {
  ticketTypeId: number
};

const ticketsService = {
  getAllTicketTypes,
  getTickets,
  createTicket
};

export default ticketsService;
