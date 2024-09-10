export interface InggestRun<T = unknown> {
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

export async function getInngestEvent<T>(eventId: string) {
  const response = await fetch(`/api/events/${eventId}/runs`, {
    cache: "no-store",
  });
  const json = await response.json();

  return json as InggestRun<T>[];
}
