interface InggestRun<T = unknown> {
  run_id: string;
  run_started_at: string;
  function_id: string;
  function_version: number;
  environment_id: string;
  event_id: string;
  status: `Running` | `Completed` | `Failed` | `Cancelled`;
  ended_at: string | null;
  output: T;
}

const NEXT_PUBLIC_INNGEST_HOST = process.env.NEXT_PUBLIC_INNGEST_HOST;

export async function getRuns<T>(eventId: string) {
  const response = await fetch(
    `${NEXT_PUBLIC_INNGEST_HOST}/v1/events/${eventId}/runs`,
    {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },
    }
  );
  const json = (await response.json()) as {
    data: InggestRun<T>[];
    metadata: { fetched_at: string; cached_until: string };
  };
  return json.data;
}
