import {
  createBitrixAuth,
  deleteBitrixAuth,
  getBitrixAuthData,
} from "../db/handlers/bitrixAuth";

export const getAccessToken = async () => {
  const bitrixAuthData = await getBitrixAuthData();

  if (bitrixAuthData.message !== "ok" || bitrixAuthData.data === null) {
    return { message: "no auth", accessToken: "" };
  }

  const isExpired =
    new Date(Number(`${bitrixAuthData.data.expires}000`)).getTime() <
    new Date().getTime();

  if (isExpired) {
    return { message: "expired", accessToken: "" };
  }

  return { message: "ok", accessToken: bitrixAuthData.data.accessToken };
};

export const getRefreshToken = async () => {
  const bitrixAuthData = await getBitrixAuthData();

  if (bitrixAuthData.message !== "ok" || bitrixAuthData.data === null) {
    return { message: "no auth", refreshToken: "" };
  }

  return { message: "ok", refreshToken: bitrixAuthData.data.refreshToken };
};

export async function reauthorizeBasedOnRefreshToken() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  try {
    const bitrixAuthData = await getBitrixAuthData();

    if (bitrixAuthData.message !== "ok" || bitrixAuthData.data === null) {
      return { message: "no auth", accessToken: "" };
    }

    const result = await fetch(
      `https://oauth.bitrix.info/oauth/token/?grant_type=refresh_token&client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${bitrixAuthData.data.refreshToken}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!result.body)
      return {
        message: "Something went wrong with reauthorization !!",
        accessToken: "",
      };

    const readed = await result.body.getReader().read();

    if (!readed.value)
      return {
        message: "Something went wrong with reauthorization !!",
        accessToken: "",
      };

    const bitrixResult = JSON.parse(Buffer.from(readed.value).toString());

    await deleteBitrixAuth();

    await createBitrixAuth(bitrixResult);

    return { message: "ok", accessToken: bitrixResult.access_token };
  } catch (err) {
    const error = err as Error;
    console.log("Error: ", error);

    return { message: `There was an error: ${error.message}`, accessToken: "" };
  }
}
