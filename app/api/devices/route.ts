// app/api/devices/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Device from "@/models/Device";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    // Return JSON error instead of redirect for API calls
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const devices = await Device.find({ userEmail: session.user.email });

  return NextResponse.json(
    devices.map((device) => ({
      id: device.deviceId,
      name: device.name || device.deviceId,
    }))
  );
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { deviceId } = await request.json();
    if (!deviceId) {
      return NextResponse.json(
        { error: "Device ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if device already exists
    const existing = await Device.findOne({
      deviceId,
      userEmail: session.user.email,
    });
    if (existing) {
      return NextResponse.json(
        { error: "Device already registered" },
        { status: 409 }
      );
    }

    // Create new device
    const device = await Device.create({
      deviceId,
      userEmail: session.user.email,
      name: deviceId,
    });

    return NextResponse.json({
      message: "Device registered",
      id: device.deviceId,
    });
  } catch (error: unknown) {
    // Log the error for debugging
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("POST /api/devices error:", errMsg);
    return NextResponse.json(
      { error: errMsg || "Internal Server Error" },
      { status: 500 }
    );
  }
}
