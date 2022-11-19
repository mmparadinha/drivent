import { prisma } from "@/config";
import { Ticket } from "@prisma/client";

async function findAllTicketTypes() {
  return prisma.ticketType.findMany();
}

async function findAllUserTickets(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId
    },
    include: {
      TicketType: true
    }
  });
}

async function findUserEnrollmentId(userId: number) {
  return prisma.enrollment.findUnique({
    where: {
      userId
    }
  });
}

async function createNewTicket(newTicket: CreateTicketParams) {
  return prisma.ticket.create({
    data: newTicket
  });
}

async function findTicketType(ticketTypeId: number) {
  return prisma.ticketType.findFirst({
    where: {
      id: ticketTypeId
    }
  });
}

export type CreateTicketParams = Omit<Ticket, "id" | "createdAt" | "updatedAt">;

const ticketRepository = {
  findAllTicketTypes,
  findAllUserTickets,
  findUserEnrollmentId,
  createNewTicket,
  findTicketType
};

export default ticketRepository;
