"use server";

export async function GET() {
  try {

    const body = {
        filter: {
            EMAIL: 'maciej.derewianski@usprawniaczefirm.pl'
        }
    };

    const result = await fetch(
      "https://mhr.bitrix24.pl/rest/user.get.json",
      {
        headers: {
          Authorization:
            "Bearer a6639b66006f2fd5006c5e630000000c000007f2f784b81d9d7552bd1fd06ff36eb7b2",
          "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify(body)
      }
    );

    if (result.status === 401) {
        // TODO: reauthorize based on refresh token, if there is no refresh token in db open new tab with authorization link
      return Response.json(
        JSON.parse(JSON.stringify({
          message: "Token error, we are doing everything that we can. :)",
        })
      ));
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
