import { prisma } from "@/config";

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findHotelRoomsById(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId
    }
  });
}

const hotelRepository = {
  findHotels,
  findHotelRoomsById,
};

export default hotelRepository;
