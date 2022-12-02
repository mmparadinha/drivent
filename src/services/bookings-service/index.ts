import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import { forbiddenError } from "@/errors/forbidden-error";

async function getBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw notFoundError();
  }

  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) {
    throw notFoundError();
  }

  return {
    id: booking.id,
    Room: booking.Room
  };
}

async function createBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const room = await bookingRepository.findRoomById(roomId);
  if (!room) {
    throw notFoundError();
  }

  if (room.Booking.length === room.capacity) {
    throw forbiddenError();
  }
  
  const newBooking = await bookingRepository.createNewBooking(userId, roomId);
  return newBooking;
}

async function updateBooking(oldBookingId: number, userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const oldBooking = await bookingRepository.findBookingByUserId(userId);
  if (!oldBooking || oldBooking.id !== oldBookingId) {
    throw forbiddenError();
  }

  const newRoom = await bookingRepository.findRoomById(roomId);
  if (!newRoom) {
    throw notFoundError();
  }

  if (newRoom.Booking.length === newRoom.capacity) {
    throw forbiddenError();
  }

  const newBooking = await bookingRepository.createNewBooking(userId, roomId);
  await bookingRepository.deleteOldBooking(oldBookingId);
  return newBooking;
}

const bookingService = {
  getBooking,
  createBooking,
  updateBooking
};

export default bookingService;
