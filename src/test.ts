import "jsr:@std/dotenv/load";
import { agentboxAuthenticate } from "./main.ts";

console.log(await agentboxAuthenticate(
    Deno.env.get("AUTH_USERNAME")!, 
    Deno.env.get("AUTH_PASSWORD")!,
    { AgentboxBaseUrl: Deno.env.get("AGENTBOX_BASE")! }
))