import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
	log: ["query"],
});

// console if prisma is connected
prisma
	.$connect()
	.then(() => {
		console.log("Prisma is connected");
	})
	.catch((error) => {
		console.error("Prisma is not connected", error);
	});

export default prisma;
