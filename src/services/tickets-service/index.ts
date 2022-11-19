import { notFoundError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import { TicketStatus } from "@prisma/client";

async function getAllTicketTypes() {
  //TODO - tipificar retorno da função
  const ticketTypes = await ticketRepository.findAllTicketTypes();
  if (!ticketTypes) throw notFoundError();

  return ticketTypes;
}

function isUserEnrolled(userId: number) {
  const userEnrollment = ticketRepository.findUserEnrollmentId(userId);
  if (!userEnrollment) throw notFoundError();

  return userEnrollment;
}

async function getTickets(userId: number) {
  const userEnrollmentInfo = await isUserEnrolled(userId);

  const userTickets = await ticketRepository.findAllUserTickets(userEnrollmentInfo.id);
  if (!userTickets) throw notFoundError();

  return userTickets;
}

async function createTicket(ticketTypeId: number, userId: number) {
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
