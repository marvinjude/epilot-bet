import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getCurrentBitcoinPrice } from "@/app/utils/getCurrentPrice";
import { inngest } from "@/app/lib/inngest";
import { Option, User } from "@/app/lib/model";

export const POST = withApiAuthRequired(async function creationOption(req) {
  try {
    const session = await getSession();

    /**
     * Initializing the user in the database. We are using a managed auth service for users
     * and we need to create a user in our database.
     *
     * TODO: Move this to auth0 `exports.onExecutePostUserRegistration`
     */

    /**
     * Check if the user already exists in the database
     */
    const users = await User.query("authUserId").eq(session?.user.sub).exec();

    let user = null;

    if (users.count === 0) {
      const newUser = await User.create({
        id: randomUUID(),
        score: 0,
        authUserId: session?.user.sub,
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
    return NextResponse.json(
      {
        success: false,
        error: "Error creating option",
      },
      { status: 500 }
    );
  }
});
