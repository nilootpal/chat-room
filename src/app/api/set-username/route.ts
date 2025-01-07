import { NextResponse } from "next/server";
import { setUsername } from "@/lib/redis";

export async function POST(req: Request) {
    const { room, username } = await req.json();
    if (!room || !username) {
        return NextResponse.json({ error: new Error("Room and username are required") }, { status: 400 });
    }
    
    const userId = Math.random().toString(36).substring(7);

    await setUsername(room, userId, username);

    return NextResponse.json({ success: true, userId });
}