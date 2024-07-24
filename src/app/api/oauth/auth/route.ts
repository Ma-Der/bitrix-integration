"use server";
import { prisma } from "../../../../../lib/prisma";
import { NextRequest } from "next/server";
import { BitrixAuthorization } from "@/types/apiTypes";

export async function GET(request: NextRequest) {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const bitrixAuthName = process.env.BITRIX_AUTH_NAME as string;

  try {
    const code = request.nextUrl.searchParams.get("code");

    if (!code) return Response.redirect("http://localhost:3000", 307);
    const authResult = await fetch(
      `https://oauth.bitrix.info/oauth/token/?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
      { method: "POST" }
    );
    const authorizationBitrix: BitrixAuthorization = await authResult.json();

    const accessToken = authorizationBitrix.access_token;
    const refreshToken = authorizationBitrix.refresh_token;
    const expires = authorizationBitrix.expires;

    const bitrixAuthData = await prisma.bitrixAuth.findUnique({
      where: { name: bitrixAuthName },
    });

    if (bitrixAuthData) {
      return Response.redirect("http://localhost:3000", 307);
    }

    await prisma.bitrixAuth.create({
      data: {
        accessToken,
        refreshToken,
        expires,
        name: bitrixAuthName,
      },
    });

    return Response.redirect("http://localhost:3000", 307);
  } catch (err: unknown) {
    const error = err as Error;
    return Response.json({ message: error.message, status: 401 });
  }
}
