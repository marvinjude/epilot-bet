import { InggestRun } from "@/app/lib/inngest/utils/getInngestEvent";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const NEXT_PUBLIC_INNGEST_HOST = process.env.NEXT_PUBLIC_INNGEST_HOST;

  const response = await fetch(
    `${NEXT_PUBLIC_INNGEST_HOST}/v1/events/${params.eventId}/runs`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },
    }
  );
  const json = (await response.json()) as {
    data: InggestRun[];
    metadata: { fetched_at: string; cached_until: string };
  };

  return NextResponse.json(json.data);
}
