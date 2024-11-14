import "jsr:@std/dotenv/load";
import { agentboxAuthenticate } from "./agentbox.ts";
import { corelogicLogin } from "./corelogic.ts";
import { configure, getSecrets } from "./1password.ts";

await configure(
    Deno.env.get("OP_TOKEN")!,
    Deno.env.get("OP_NAME")!,
    Deno.env.get("OP_VERSION")!,
)

console.log(await getSecrets("Automation", "CoreLogic", "username", "password"));

const [abUser, abPass] = await getSecrets("Automation", "Reapit", "username", "password");

console.log(await agentboxAuthenticate(
    abUser, 
    abPass,
    { AgentboxBaseUrl: Deno.env.get("AGENTBOX_BASE")! }
))

let [clUser, clPass] = await getSecrets("Automation", "CoreLogic", "username", "password");

console.log(await corelogicLogin(
    clUser,
    clPass
))