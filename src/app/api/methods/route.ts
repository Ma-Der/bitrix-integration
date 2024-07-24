"use server";

import { getBitrixToken } from "../../../../lib/bitrixAuth";

export async function GET() {
  const clientUrl = process.env.CLIENT_URL;
  const tokenData = await getBitrixToken();
  try {
    if (tokenData.message === "reauth" || tokenData.data === null) {
      return Response.json({ message: "reauth", data: null });
    }

    const result = await fetch(`${clientUrl}/rest/methods.json`, {
      headers: {
        Authorization: `Bearer ${tokenData.data}`,
        "Content-Type": "application/json",
      },
    });

    const bitrixResult = await result.json();

    return Response.json({ message: "ok", data: bitrixResult });
  } catch (err) {
    const error = err as Error;
    console.log(error);

    return Response.json({ message: "error", data: error });
  }
}
