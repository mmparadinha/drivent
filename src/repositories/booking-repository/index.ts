import { prisma } from "@/config";

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId
    },
    include: {
      Room: true,
    }
  });
}

async function createNewBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    }
  });
}

async function findRoomById(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      Booking: true
    }
  });
}

async function deleteOldBooking(bookingId: number) {
  return prisma.booking.delete({
    where: {
      id: bookingId
    }
  });
}

const bookingRepository = {
  findBookingByUserId,
  createNewBooking,
  findRoomById,
  deleteOldBooking,
};

export default bookingRepository;
