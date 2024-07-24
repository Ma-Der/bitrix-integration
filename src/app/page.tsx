"use client";
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const clientUrl = process.env.CLIENT_URL;
const redirectUri = `http://localhost:3000/api/oauth/auth`;

export default function Home() {
  const getUser = async () => {
    const res = await fetch(`http://localhost:3000/api/user`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: "maciej.derewianski@usprawniaczefirm.pl",
      }),
    });
    const response = await res.json();
    console.log(response);
  };
  return (
    <main>
      <button onClick={getUser}>Check user</button>
    </main>
  );
}
