# Research Questions

1. Which active `openspec/changes/deckgl-react-compat/*` artifacts still mention widget support, `useWidget`, or widget wrappers, and in which sections do those references appear?

2. Which active `openspec/changes/deckgl-react-compat/*` artifacts still describe the older partial wrapper plan (for example the prior `15-20` layer wording), and which artifacts now define the approved inventory-backed wrapper matrix?

3. Which active `openspec/changes/deckgl-react-compat/*` artifacts use the official term `Render callbacks`, and which artifacts still use older or unclear wording for function children?

4. What migration promise is stated in the current `proposal.md`, `design.md`, and compat specs: full parity, reduced rewrite work for supported patterns, or some other scope?

5. What evidence in the current repo defines the official `@deck.gl/react` public surface relevant to this change, including props, ref methods, context fields, child patterns, and package export shape?

6. What package entrypoints does official `@deck.gl/react` export today, and is there evidence of official `/layers`, `/geo-layers`, or similar subpath exports?

7. What layer and view coverage is already encoded in `packages/types/src/jsx.ts` through deprecated intrinsic JSX support?

8. What evidence in the current codebase distinguishes native instance-first support (`<layer>` / `<view>`) from the proposed compat wrapper surface?

9. What official `DeckGL` prop boundary is documented upstream, and how does it differ from the current native `DeckglProps` type in `packages/types/src/react.ts`?

10. What imperative ref methods are documented by official `@deck.gl/react`, and which of those methods match the approved compat ref inventory in this change?

11. What context fields are documented by official `@deck.gl/react`, and which of those fields are directly available from the current fiber.gl store and hooks?

12. What evidence shows whether official React child semantics include more than layer/view extraction, such as `Render callbacks`, `ContextProvider`, or widget React components?

13. What current repo evidence exists for interleaved-mode constraints that affect compat view behavior?

14. What current repo evidence exists for stable layer ID requirements and development-time validation that may affect migration behavior?

15. Which tests already exist in `packages/dom`, `packages/reconciler`, and `packages/types` that are relevant to a compat research matrix, and which compat-specific tests do not yet exist?

16. Which source files provide the primary empirical evidence for this research pass?

17. Which questions remain unanswered after reviewing the current repo and upstream `@deck.gl/react` docs/source, and why are they still unanswered?
