import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SensorData from "@/models/SensorData";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { deviceId, type, value } = body;
  if (!deviceId || !type || value === undefined) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  await connectDB();

  await SensorData.create({
    deviceId,
    type,
    value,
    timestamp: new Date(),
  });

  return NextResponse.json({ message: "Data saved" });
}
