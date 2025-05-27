import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { DeviceData } from "@/models/DeviceData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { deviceId, type, value } = body;

  if (!deviceId || !type || value === undefined) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  await connectDB();

  try {
    await DeviceData.create({
      deviceId,
      type,
      value: parseFloat(value),
      timestamp: new Date().toISOString(),
      userId: session.user.email,
    });

    return NextResponse.json({ message: "Data saved to DeviceData" });
  } catch (error) {
    console.error("Error saving to DeviceData:", error);
    return NextResponse.json({ message: "Error saving data" }, { status: 500 });
  }
}
