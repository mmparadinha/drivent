import { prisma } from "@/config";
import { Payment, TicketStatus } from "@prisma/client";

async function findAcessedTicket(ticketId: number) {
  const id = Number(ticketId);
  return prisma.ticket.findFirst({
    where: {
      id
    }
  });
}

async function findTicketPayment(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId
    }
  });
}

async function findTicketPrice(id: number) {
  return prisma.ticketType.findUnique({
    where: {
      id
    }
  });
}

async function postPayment(newPayment: CreatePaymentParams) {
  return prisma.payment.create({
    data: newPayment
  });
}

async function updateTicketStatus(id: number) {
  return prisma.ticket.update({
    where: {
      id
    },
    data: {
      status: TicketStatus.PAID
    }
  });
}

export type CreatePaymentParams = Omit<Payment, "id" | "Ticket" | "createdAt" | "updatedAt">;

const paymentRepository = {
  findAcessedTicket,
  findTicketPayment,
  findTicketPrice,
  postPayment,
  updateTicketStatus
};

export default paymentRepository;
