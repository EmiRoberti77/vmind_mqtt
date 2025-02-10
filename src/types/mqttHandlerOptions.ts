import { z } from "zod";

export const mqttHandlerOptionsSchema = z.object({
  host: z.string(),
  port: z.number().default(8883),
  protocol: z.enum(["mqtt", "mqtts", "ws", "wss"]).default("mqtts"),
  ca: z.string().describe("CA Certificate"),
  cert: z.string().describe("Client Certificate"),
  key: z.string().describe("Client Key"),
  rejectUnauthorized: z
    .boolean()
    .default(false)
    .describe("Set to true in production)"),
});

export type MQTTHandlerOptions = z.infer<typeof mqttHandlerOptionsSchema>;
