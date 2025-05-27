// app/api/data/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import { DeviceData } from "@/models/DeviceData";

export async function GET(req: Request) {
  try {
    // MongoDB холболтыг энд хийх
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get("deviceId");

    console.log("Fetching data for deviceId:", deviceId); // Debug log

    if (!deviceId) {
      return NextResponse.json(
        { error: "Device ID is required" },
        { status: 400 }
      );
    }

    // Өгөгдлийг авах query-г илүү өргөн хүрээтэй болгох
    const data = await DeviceData.find({
      deviceId: deviceId,
      // userId шалгалтыг түр хасах эсвэл өөрчлөх
      // userId: session.user?.email,
      timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // 30 өдрийн өгөгдөл
    })
      .sort({ timestamp: -1 })
      .limit(1000); // Хязгаар тавих

    console.log("Found data count:", data.length); // Debug log

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
