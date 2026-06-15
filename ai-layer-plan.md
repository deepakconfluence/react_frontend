# Agentic AI in a React App — Claude + Tool-Use + RAG over the Unified Data Layer

## Context

Per the modernization strategy, the stack is built bottom-up:

1. **Ingestion / ETLs** — custodial (BofA + a second vendor replacing PCR), manager, benchmark data.
2. **Unified data layer** — one canonical model with consistent IDs, history, and data-quality /
   exception flagging.
3. **APIs** — clean, secured services over the unified layer.
4. **Agentic AI layer** — this document, surfaced in a **React** application.

AI quality is capped by data quality, so the agent **does not compute analytics itself** — it calls
the trusted APIs (layer 3) as *tools* and grounds explanations via *RAG* over the unified data +
docs (layer 2). Build/confirm layers 2–3 first.

## ⚠️ The rule that drives the React architecture

**Never call the Anthropic API from the browser, and never put the API key in React.** A browser
bundle is fully inspectable — an embedded key is a leaked key. Tool execution also must run
server-side (it calls your data APIs with real auth and per-user data scope). Therefore:

> **React (browser) ⇄ your BFF (server, holds the key, runs the agent loop) ⇄ Anthropic + your data APIs.**

React renders the conversation and drives interaction; the **BFF** does all Claude calls, tool
execution, RAG, guardrails, and audit, and **streams** results back to React.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | **React + TypeScript** (Vite/Next.js). Chat UI, token streaming, agent-step timeline, tool-approval prompts, citations. **No `@anthropic-ai/sdk` calls in the browser** — use it only for shared *types* if convenient. |
| BFF / agent host | **Node + TypeScript** service using **`@anthropic-ai/sdk`**. Holds the key (secrets manager), runs the agentic loop, executes tools, does RAG + guardrails + audit, exposes a streaming endpoint. (Can also be added to the existing backend, but a Node/TS BFF matches the React stack and the SDK best.) |
| Transport | **SSE** (or WebSocket) BFF → React for live tokens, thinking, tool-use steps, and approval requests. |
| Models | `claude-opus-4-8` (reasoning/analytics); `claude-haiku-4-5` (routing/classification). Adaptive thinking + `effort`. |

## Choose the agent surface (BFF-side)

- **Recommended: Claude API + tool use, loop hosted in your BFF.** Maximum control over tool
  execution, data-access auth, human-in-the-loop, and audit — which a regulated financial app needs.
  Use the SDK's **tool runner** (`client.beta.messages.toolRunner`, streaming) for the happy path,
  or the **manual loop** when you need an approval gate before a tool runs.
- **Alternative: Managed Agents.** Anthropic hosts the agent loop + a per-session container and
  streams SSE events; your BFF relays them to React and answers `agent.custom_tool_use` events with
  your data. Good fit if you want a stateful, server-managed agent with a workspace — but custom
  data tools still round-trip through your BFF, and it's a heavier model. Start with the BFF loop.

## Components

### 1. React frontend (TypeScript)
- Chat surface that consumes the BFF's **SSE stream**: render `text` deltas live, show
  `thinking`/`tool_use` steps as an agent-step timeline, render citations.
- **Human-in-the-loop UI**: when the BFF emits a "tool needs approval" event, show an approve/deny
  modal; post the decision back to the BFF.
- Talks only to the BFF (`/api/agent/...`) with the app's own session auth — never to Anthropic.

### 2. BFF / agent host (Node + TypeScript, `@anthropic-ai/sdk`)
- `new Anthropic()` with the key from a secrets manager.
- **Frozen system prompt**, cached: role, canonical data model, "cite the source; never invent
  figures," refusal posture. `cache_control: { type: "ephemeral" }` on the last system block; keep
  it byte-stable (no per-request timestamps/IDs) so the prefix cache hits.
- **Tool registry** — one tool per unified-data **read API** (allocations, returns, fees, plan data,
  exceptions). Define with `betaZodTool` (Zod schema → typed inputs) or strict JSON schema. Start
  narrow (allocations + returns for an entity+date), expand; adopt **tool search** as the set grows.
- **Agent loop** — `toolRunner({ stream: true })` for the common path; **manual loop** when a tool
  needs approval (pause, emit an approval event to React, resume on the user's decision). Handle
  `pause_turn` (server-tool continue) and `refusal` (surface, don't auto-retry).
- **Streaming bridge** — forward SDK stream events to React over SSE (text, thinking, tool-use,
  approval-needed, done).
- `thinking: { type: "adaptive" }` + `output_config: { effort: "high" }` for analytics; `medium`/
  Haiku for routing.

### 3. Retrieval (RAG) — BFF side
- Vector store: **pgvector** or **Azure AI Search**. Index unified-data row summaries + metadata +
  methodology/disclosure docs; chunk + embed on ingest; re-index on the data-layer refresh cadence.
- A `search_knowledge` tool (or a pre-retrieval step) returns grounded snippets the model must cite.

### 4. Guardrails & governance (BFF side — non-negotiable for regulated financial data)
- **Per-user data scope + tool allow-list** enforced in the BFF/tools (from the app's session auth),
  not in the prompt. The browser cannot be trusted to scope data.
- **Validate** every tool input before calling the API; **human-in-the-loop** approval for
  client-facing or hard-to-reverse actions (the React approval modal).
- **Refusal handling** — on `stop_reason === "refusal"`, surface `stop_details`, log, don't retry.
- **Audit log** — persist `request-id`, prompt, every tool call + result, and the final answer to an
  immutable store.
- **PII** — redact/scope before indexing or sending.

## Build order

1. **BFF skeleton + tool contracts** — Node/TS service, `Anthropic` client, cached system prompt,
   Zod tools for the first 2–3 unified-data read APIs, and an SSE endpoint.
2. **React chat + streaming** — consume SSE, render tokens + agent-step timeline; one end-to-end use
   case ("ask about a plan/universe's allocations & returns") with audit logging.
3. **Human-in-the-loop** — manual-loop approval gate in the BFF + approve/deny modal in React.
4. **RAG** — index unified-data summaries + docs; add `search_knowledge`; grounded insights with citations.
5. **Guardrails + scale** — per-user scope, refusal handling, tool search as the tool set grows.

## Notes / dependencies

- **Depends on the unified data layer + read APIs** (layers 2–3) — build/confirm those first.
- **Key custody is the headline risk**: no Anthropic key or direct Anthropic calls in the React
  bundle — everything Claude-facing is BFF-only.
- **Prompt caching** pays off (large, reused system+schema prompt) — verify
  `usage.cache_read_input_tokens > 0`; keep the prefix byte-stable.
- The existing .NET platform can host the data APIs (layer 3); the BFF just calls them. The BFF
  itself is Node/TS to match React + the TypeScript SDK.

## Verification

1. Confirm the **browser** never receives the API key and never calls `api.anthropic.com` directly
   (Network tab shows only calls to the BFF).
2. Ask a question needing a known API value (e.g., a universe's median allocation for a date) → the
   agent calls the tool and the number **matches the API/DB exactly**; the tool call + result appear
   in the audit log with a `request-id`.
3. Ask an "explain/insight" question → answer cites retrieved snippets (RAG); no ungrounded claims.
4. Trigger an approval-gated tool → React shows the approve/deny modal; denying stops the action.
5. Repeated calls show `usage.cache_read_input_tokens > 0` (system-prompt cache hitting).
6. Out-of-scope/disallowed request → clean refusal surfaced from `stop_details`, logged.
