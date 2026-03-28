export const runtime = "edge";

export function GET() {
  return Response.json({
    version: "v4-edge-streaming",
    deployed: new Date().toISOString(),
    ai: "raw-fetch-edge",
  });
}
