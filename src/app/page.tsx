"use client";

import { BitrixGetUser, BitrixResponse } from "@/types/apiTypes";

export default function Home() {
  const getUser = async () => {
    const res = await fetch(`/api/user`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: "maciej.derewianski@usprawniaczefirm.pl",
      }),
    });
    const response: BitrixResponse<BitrixGetUser[]> = await res.json();
    console.log(response);
  };
  return (
    <main>
      <button onClick={getUser}>Check user</button>
    </main>
  );
}
