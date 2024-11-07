import "jsr:@std/dotenv/load";
import { agentboxAuthenticate } from "./agentbox.ts";
import { corelogicLogin } from "./corelogic.ts";

// console.log(await agentboxAuthenticate(
//     Deno.env.get("AGENTBOX_USERNAME")!, 
//     Deno.env.get("AGENTBOX_PASSWORD")!,
//     { AgentboxBaseUrl: Deno.env.get("AGENTBOX_BASE")! }
// ))

console.log(await corelogicLogin(
    Deno.env.get("CORELOGIC_USERNAME")!,
    Deno.env.get("CORELOGIC_PASSWORD")!
))