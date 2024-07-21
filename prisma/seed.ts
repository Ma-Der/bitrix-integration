import { prisma } from "../lib/prisma";

async function main() {
  const name = process.env.BITRIX_AUTH_NAME;

  const bitrixTest = await prisma.bitrixAuth.upsert({
    where: { name },
    update: {},
    create: {
      accessToken: "test",
      expires: 0,
      name: "test",
      refreshToken: "test",
    },
  });

  console.log(bitrixTest);
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
