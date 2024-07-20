export async function GET() {
  const clientId = process.env.CLIENT_ID;
  const clientUrl = process.env.CLIENT_URL;
  const redirectUri = process.env.REDIRECT_URI;

  return Response.redirect(
    `${clientUrl}/oauth/authorize/?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`
  );
}
