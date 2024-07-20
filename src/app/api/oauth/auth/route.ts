import { NextRequest } from "next/server";
import { BitrixAuthorization } from "@/types/apiTypes";

export async function GET(request: NextRequest) {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  try {
    const code = request.nextUrl.searchParams.get("code");
console.log("code: ", code)
    if (!code) return Response.redirect('http://localhost:3000', 307);
      const authResult = await fetch(
        `https://oauth.bitrix.info/oauth/token/?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
        { method: "POST" }
      );
  
      if(!authResult.body) return Response.json({message: 'Something went wrong with authorization !!'});
      
      const readed = await authResult.body.getReader().read();
  
      if(!readed.value) return Response.json({message: 'Something went wrong with authorization !!'});
  
      const authorizationBitrix: BitrixAuthorization = JSON.parse(Buffer.from(readed.value).toString());
      const accessToken = authorizationBitrix.access_token;
      const refreshToken = authorizationBitrix.refresh_token;
      console.log(authorizationBitrix)
      console.log(accessToken)
      console.log(refreshToken)
    return Response.redirect('http://localhost:3000', 307);
  }
  catch(err: unknown) {
    const error = err as Error;
    return Response.json({message: error.message, status: 401});
  }
}
