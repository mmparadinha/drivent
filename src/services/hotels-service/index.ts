import { notFoundError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getHotels(userId: number) {
  await hotelAcessValidation(userId);

  const hotels = await hotelRepository.findHotels();
  if (!hotels) {
    throw notFoundError();
  }

  return hotels;
}

async function getHotelRooms(userId: number, hotelId: number) {
  await hotelAcessValidation(userId);

  const hotelRooms = await hotelRepository.findHotelRoomsById(hotelId);
  if (hotelRooms.length === 0) {
    throw notFoundError();
  }

  return hotelRooms;
}

async function hotelAcessValidation(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }

  if (ticket.TicketType.isRemote === true
    || ticket.TicketType.includesHotel === false
    || ticket.status === "RESERVED") {
    throw unauthorizedError();
  }
}

const hotelService = {
  getHotels,
  getHotelRooms,
};

export default hotelService;
