"use server";

import { NextRequest } from "next/server";
import { getBitrixToken } from "../../../../lib/bitrixAuth";

export async function POST(req: NextRequest) {
  const clientUrl = process.env.CLIENT_URL;
  try {
    const accessTokenData = await getBitrixToken();

    if (accessTokenData.message === "reauth" || accessTokenData.data === null) {
      return Response.json({ message: "reauth", data: null });
    }
    const reqBody = await req.json();
    const body = {
      filter: {
        EMAIL: reqBody.email,
      },
    };

    const result = await fetch(`${clientUrl}/rest/user.get.json`, {
      headers: {
        Authorization: `Bearer ${accessTokenData.data}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
    });

    const bitrixResult = await result.json();

    return Response.json({ message: "ok", data: bitrixResult.result });
  } catch (err) {
    const error = err as Error;
    console.log("Error: ", error);

    return Response.json({ message: "error", data: error });
  }
}
