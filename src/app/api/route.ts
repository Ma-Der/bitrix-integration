import { NextRequest, NextResponse } from "next/server";

export async function GET(response: Response, request: Request) {
    console.log(request)
    return Response.redirect('http://localhost:3000', 200);
}

export async function POST(response: NextResponse, request: NextRequest) {
    console.log(request)

    return Response.redirect('http://localhost:3000', 200);
}