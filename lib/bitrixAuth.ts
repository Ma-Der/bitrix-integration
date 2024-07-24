"use server";
import {
  createBitrixAuth,
  deleteBitrixAuth,
  getBitrixAuthData,
} from "../db/handlers/bitrixAuth";

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

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

    const bitrixResult = await result.json();

    await deleteBitrixAuth();

    await createBitrixAuth(bitrixResult);

    return { message: "ok", accessToken: bitrixResult.access_token };
  } catch (err) {
    const error = err as Error;
    console.log("Error: ", error);

    return { message: `There was an error: ${error.message}`, accessToken: "" };
  }
}

export const getBitrixToken = async () => {
  const accessTokenData = await getAccessToken();
  let accessToken = "";

  if (accessTokenData.message === "ok") {
    accessToken = accessTokenData.accessToken;
  }

  if (accessTokenData.message === "no auth") {
    return { message: "reauth", data: null };
  }

  if (accessTokenData.message === "expired") {
    const reauthResult = await reauthorizeBasedOnRefreshToken();

    if (reauthResult.message === "ok") {
      accessToken = reauthResult.accessToken;
    }

    if (reauthResult.message !== "ok") {
      return { message: "reauth", data: null };
    }
  }

  return { message: "ok", data: accessToken };
};
