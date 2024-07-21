"use server";

import { reauthorizeBasedOnRefreshToken } from "../../../../lib/bitrixAuth";
import { getAccessToken } from "../../../../lib/bitrixAuth";

export async function GET() {
  const clientUrl = process.env.CLIENT_URL;
  const accessTokenData = await getAccessToken();
  let accessToken: string = "";

  try {
    if (accessTokenData.message === "ok") {
      accessToken = accessTokenData.accessToken;
    }

    if (accessTokenData.message === "no auth") {
      //TODO: redirects change to returning for example object {message: 'reauth'} and on the frontend this triggers new window with Bitrix authorization
      return Response.redirect("http://localhost:3000/api/oauth", 307);
    }

    if (accessTokenData.message === "expired") {
      const reauthResult = await reauthorizeBasedOnRefreshToken();

      if (reauthResult.message === "ok") {
        accessToken = reauthResult.accessToken;
      }

      if (reauthResult.message !== "ok") {
        //TODO: redirects change to returning for example object {message: 'reauth'} and on the frontend this triggers new window with Bitrix authorization
        return Response.redirect("http://localhost:3000/api/oauth", 307);
      }
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
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(bodyToCreateFieldInUserfield),
      }
    );

    if (result.status === 401) {
      const reauthResult = await reauthorizeBasedOnRefreshToken();

      if (reauthResult?.message === "Ok.") {
      }
      return Response.json(
        JSON.parse(
          JSON.stringify({
            message: "Token error, we are doing everything that we can. :)",
          })
        )
      );
    }
    if (!result.body)
      return Response.json({
        message: "Something went wrong with authorization !!",
      });

    const readed = await result.body.getReader().read();

    if (!readed.value)
      return Response.json({
        message: "Something went wrong with authorization !!",
      });

    const bitrixResult = JSON.parse(Buffer.from(readed.value).toString());
    console.log("bitrixResult: ", bitrixResult);
    return Response.json(bitrixResult);
  } catch (err) {
    const error = err as Error;
    console.log("Error: ", error);

    return Response.json(JSON.stringify(error));
  }
}
