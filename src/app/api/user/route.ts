"use server";

import {
  getAccessToken,
  reauthorizeBasedOnRefreshToken,
} from "../../../../lib/bitrixAuth";

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

    const body = {
      filter: {
        EMAIL: "maciej.derewianski@usprawniaczefirm.pl",
      },
    };

    const result = await fetch(`${clientUrl}/rest/user.get.json`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
    });

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

    return Response.json(bitrixResult);
  } catch (err) {
    const error = err as Error;
    console.log("Error: ", error);

    return Response.json(JSON.stringify(error));
  }
}
