import assert from "node:assert/strict";
import test from "node:test";
import { metricFromMessage } from "../lib/session-metrics.js";

test("records metadata without message content", () => {
  const metric = metricFromMessage({
    id: "msg-1",
    sessionID: "private-session",
    role: "assistant",
    agent: "explore",
    providerID: "openai",
    modelID: "gpt-5.4-mini",
    time: { created: 1000, completed: 2500 },
    cost: 0.01,
    tokens: { input: 100, output: 20, reasoning: 5, cache: { read: 40, write: 0 } },
    content: "must not be logged",
  }, { tools: 3, delegations: 1, compactions: 0 });

  assert.equal(metric.duration_ms, 1500);
  assert.equal(metric.tokens.input, 100);
  assert.equal(metric.delegations, 1);
  assert.equal(metric.content, undefined);
  assert.notEqual(metric.session, "private-session");
});

test("ignores incomplete and user messages", () => {
  assert.equal(metricFromMessage({ role: "user", time: { completed: 1 } }), null);
  assert.equal(metricFromMessage({ role: "assistant", time: { created: 1 } }), null);
});
