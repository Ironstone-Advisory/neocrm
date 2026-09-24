# Outcome learning and evaluation

**Status:** Proposed

Learning from outcomes is a governed improvement loop, not uncontrolled self-modification.

```text
Goal and intended Outcome
  -> Plan, decisions, work, and Actions
  -> observed Outcome and unintended effects
  -> attributed LearningSignals and feedback
  -> comparison / EvaluationRun
  -> proposed prompt, model, mapping, policy, workflow, or capability change
  -> human and policy review
  -> held-out CTS, safety, fairness, cost, and regression evaluation
  -> approved versioned release
  -> monitored result and rollback decision
```

## Separation of duties

- Production Agents may record candidate LearningSignals but cannot change their own AgentDefinition, Delegation, ToolGrants, evaluation criteria, or policy.
- Evaluators cannot deploy the changes they score.
- Customer feedback remains attributed evidence and cannot silently become a profile Fact.
- Business Outcomes are evaluated alongside customer, service, ethical, cost, and safety Outcomes.
- Offline and shadow evaluation precede expanded autonomy; negative and inconclusive results are retained.

Evaluation evidence identifies dataset/cases, versions, rubric, evaluator, date, limitations, failures, and result scope. Synthetic CAP-001 conformance cannot validate live human usefulness or causal business impact.
