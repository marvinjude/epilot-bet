import { inngest } from "@/app/lib/inngest";
import { resolveOption } from "@/app/lib/inngest/functions/resolve-option";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [resolveOption],
});
