"use server";

import { getBitrixToken } from "../../../../lib/bitrixAuth";

export async function GET() {
  const clientUrl = process.env.CLIENT_URL;
  try {
    const accessTokenData = await getBitrixToken();

    if (accessTokenData.message === "reauth" || accessTokenData.data === null) {
      return Response.json({ message: "reauth", data: null });
    }

    const body = {
      filter: {
        EMAIL: "maciej.derewianski@usprawniaczefirm.pl",
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

    if (!result.body)
      return Response.json({
        message: "Something went wrong with authorization !!",
        data: null,
      });

    const readed = await result.body.getReader().read();

    if (!readed.value)
      return Response.json({
        message: "Something went wrong with authorization !!",
        data: null,
      });

    const bitrixResult = JSON.parse(Buffer.from(readed.value).toString());

    return Response.json({ message: "ok", data: bitrixResult });
  } catch (err) {
    const error = err as Error;
    console.log("Error: ", error);

    return Response.json({ message: "error", data: error });
  }
}
