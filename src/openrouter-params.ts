import type { ExtensionAPI, ExtensionCommandContext } from "@earendil-works/pi-coding-agent";

interface Overrides { temperature?: number; top_p?: number; top_k?: number; }

const state: Overrides = {
 temperature: process.env.OPENROUTER_TEMPERATURE ? Number(process.env.OPENROUTER_TEMPERATURE) : undefined,
 top_p:      process.env.OPENROUTER_TOP_P        ? Number(process.env.OPENROUTER_TOP_P)        : undefined,
 top_k:      process.env.OPENROUTER_TOP_K        ? Number(process.env.OPENROUTER_TOP_K)        : undefined,
};

export default function (pi: ExtensionAPI) {
 pi.registerFlag("or-temp",   { type: "number", description: "OpenRouter temperature", default: undefined });
 pi.registerFlag("or-top-p",  { type: "number", description: "OpenRouter top_p",    default: undefined });
 pi.registerFlag("or-top-k",  { type: "number", description: "OpenRouter top_k",    default: undefined });

 pi.registerCommand("or-params", {
   description: "Show or set OpenRouter temperature / top_p / top_k. Usage: /or-params [temp] [top_p] [top_k] — e.g. /or-params 0.6 0.95 20",
   handler(args: string, ctx: ExtensionCommandContext) {
	 // args is a raw string from the CLI, parse positional values
	 const parts = args.trim() ? args.trim().split(/\s+/) : [];
	 if (parts.length >= 1) {
	   const val = Number(parts[0]);
	   if (!isNaN(val)) state.temperature = val;
	 }
	 if (parts.length >= 2) {
	   const val = Number(parts[1]);
	   if (!isNaN(val)) state.top_p = val;
	 }
	 if (parts.length >= 3) {
	   const val = Number(parts[2]);
	   if (!isNaN(val) && val >= 0 && Number.isInteger(val)) state.top_k = val;
	 }

	 const out = [
	   "OpenRouter overrides:",
	   `  temperature: ${state.temperature ?? "(default)"}`,
	   `  top_p:       ${state.top_p ?? "(default)"}`,
	   `  top_k:       ${state.top_k ?? "(default)"}`,
	 ].join("\n");
	 ctx.ui.notify(out, "info");
   },
 });

 pi.on("session_start", async () => {
   const t = pi.getFlag<number>("or-temp");
   const p = pi.getFlag<number>("or-top-p");
   const k = pi.getFlag<number>("or-top-k");
   if (t !== undefined) state.temperature = t;
   if (p !== undefined) state.top_p       = p;
   if (k !== undefined) state.top_k       = k;
 });

 pi.on("before_provider_request", (event, ctx) => {
   if (!ctx.model || ctx.model.provider !== "openrouter") return;
   const o: Record<string, unknown> = {};
   if (state.temperature !== undefined) o.temperature = state.temperature;
   if (state.top_p !== undefined)       o.top_p       = state.top_p;
   if (state.top_k !== undefined)       o.top_k       = state.top_k;
   if (Object.keys(o).length === 0) return;
   return { ...event.payload, ...o };
 });
}

