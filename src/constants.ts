import "jsr:@std/dotenv/load";

export const KV_CONNECT_URL = Deno.env.get("KV_CONNECT_URL");

export default { KV_CONNECT_URL };
