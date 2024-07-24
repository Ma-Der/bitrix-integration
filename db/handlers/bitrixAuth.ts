import { prisma } from "../../lib/prisma";
import { BitrixAuthData } from "../types/bitrixAuth";

const bitrixAuthName = process.env.BITRIX_AUTH_NAME as string;

export const getBitrixAuthData = async () => {
  const bitrixData = await prisma.bitrixAuth.findUnique({
    where: { name: bitrixAuthName },
  });

  if (!bitrixData) return { message: "no auth data", data: null };

  return { message: "ok", data: bitrixData };
};

export const deleteBitrixAuth = async () => {
  await prisma.bitrixAuth.delete({
    where: {
      name: bitrixAuthName,
    },
  });
};

export const createBitrixAuth = async (bitrixData: BitrixAuthData) => {
  await prisma.bitrixAuth.create({
    data: {
      accessToken: bitrixData.access_token,
      refreshToken: bitrixData.refresh_token,
      expires: bitrixData.expires,
      name: bitrixAuthName,
    },
  });
};
