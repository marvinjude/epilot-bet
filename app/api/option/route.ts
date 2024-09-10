import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getCurrentBitcoinPrice } from "@/app/utils/getCurrentPrice";
import { inngest } from "@/app/lib/inngest";
import { Option, User } from "@/app/lib/model";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    /**
     * Initializing the user in the database. We are using a managed auth service for users
     * and we need to create a user in our database.
     *
     * TODO: Create user in app db after succeessful reg
     */

    /**
     * Check if the user already exists in the database
     */
    const users = await User.query("authUserId").eq(userId).exec();

    let user = null;

    if (users.count === 0) {
      const newUser = await User.create({
        id: randomUUID(),
        score: 0,
        authUserId: userId as string,
      });

      user = newUser;
    } else {
      user = users[0];
    }
    // -------------------------------------------

    const body = await req.json();

    const priceAtCreation = await getCurrentBitcoinPrice();

    const newOption = new Option({
      id: randomUUID(),
      userId: user?.id,
      type: body.optionType,
      priceAtCreation: priceAtCreation,
      createdAt: new Date(body.timestamp),
      resolved: false,
    });

    const option = await newOption.save();

    const injestData = await inngest.send({
      name: "test/resolve.option",
      data: {
        user,
        option,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...option,
        jobId: injestData.ids[0],
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        error: "Error creating option",
      },
      { status: 500 }
    );
  }
}
