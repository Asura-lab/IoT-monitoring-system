// app/api/data/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import { DeviceData } from "@/models/DeviceData";

await mongoose.connect(process.env.MONGODB_URI!);

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get("deviceId");

  const data = await DeviceData.find({
    deviceId,
    userId: session.user?.email, // or userId
    timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // last 7 days
  }).sort({ timestamp: -1 });

  return NextResponse.json(data);
}
