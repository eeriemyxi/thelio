import "jsr:@std/dotenv/load";
import { GLOBAL_CSS } from "./global_css.ts";

export const KV_CONNECT_URL = Deno.env.get("KV_CONNECT_URL");

export default { KV_CONNECT_URL, GLOBAL_CSS };
