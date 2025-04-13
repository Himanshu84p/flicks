import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    connectToDB();
    // By default, Mongoose queries return an instance of the Mongoose Document class. Documents are much heavier than vanilla JavaScript objects, because they have a lot of internal state for change tracking. Enabling the lean option tells Mongoose to skip instantiating a full Mongoose document and just give you the POJO.
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    connectToDB();

    const body: IVideo = await request.json();

    //validate require fields before creating
    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    //creating video object
    const videoData = {
      ...body,
      controls: body?.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body?.transformation?.quality ?? 100,
      },
    };

    const createdVideo = await Video.create(videoData);

    if (!createdVideo) {
      return NextResponse.json(
        { error: "Failed to create video" },
        { status: 500 }
      );
    }

    return NextResponse.json({ createdVideo }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error in creating video" },
      { status: 500 }
    );
  }
}
