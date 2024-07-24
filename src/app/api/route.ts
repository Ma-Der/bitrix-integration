import { NextRequest, NextResponse } from "next/server";

export async function GET(response: Response, request: Request) {
  return Response.redirect("http://localhost:3000", 200);
}

export async function POST(response: NextResponse, request: NextRequest) {
  return Response.redirect("http://localhost:3000", 200);
}
