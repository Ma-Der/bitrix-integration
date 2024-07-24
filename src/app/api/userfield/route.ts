"use server";

import { getBitrixToken } from "../../../../lib/bitrixAuth";

export async function GET() {
  const clientUrl = process.env.CLIENT_URL;
  try {
    const accessTokenData = await getBitrixToken();

    if (accessTokenData.message === "reauth" || accessTokenData.data === null) {
      return Response.json({ message: "reauth", data: null });
    }

    const bodyToDeleteFieldInUserfield = {
      id: "256",
      fields: {
        LIST: [
          {
            ID: "58",
            DEL: "Y",
          },
        ],
      },
    };

    const bodyToCreateFieldInUserfield = {
      id: "256",
      fields: {
        LIST: [
          {
            VALUE: "some value",
          },
        ],
      },
    };

    const result = await fetch(
      `${clientUrl}/rest/crm.deal.userfield.update.json`,
      {
        headers: {
          Authorization: `Bearer ${accessTokenData.data}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(bodyToCreateFieldInUserfield),
      }
    );

    const bitrixResult = await result.json();

    return Response.json({ message: "ok", data: bitrixResult });
  } catch (err) {
    const error = err as Error;
    console.log("Error: ", error);

    return Response.json({ message: "error", data: error });
  }
}
