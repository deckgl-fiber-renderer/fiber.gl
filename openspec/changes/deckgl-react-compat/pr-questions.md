# PR Review Context and Open Questions

Source artifacts reviewed:
- PR comments: https://api.github.com/repos/deckgl-fiber-renderer/fiber.gl/pulls/20/comments
- Original proposal: `openspec/changes/deckgl-react-compat/proposal.md`
- Original design: `openspec/changes/deckgl-react-compat/design.md`
- Widget docs:
  - https://deck.gl/docs/api-reference/widgets/overview
  - https://deck.gl/docs/api-reference/widgets/stats-widget
  - https://deck.gl/docs/api-reference/widgets/styling

## Confirmed review feedback

### 1. Widgets should not be part of this change

Reviewer comments on `proposal.md`:
- "Does fiber.gl have a `<widget>`? The official react binding for widgets doesn't add anything over using the normal `widgets` props, so I'd prefer to drop the wrappers."
- "Connected to above, I'd prefer to not use the `useWidget` hook."

Implication for the next QRSPI pass:
- Remove widget wrappers and `useWidget` hook from scope for this change.
- Treat JSX widget support as a separate future change.
- Preserve plain `widgets` prop compatibility discussion only if needed for migration docs, not as a new compat abstraction.

Current code/spec context supporting this:
- Existing examples/specs use direct widgets prop patterns, e.g. `widgets={[new StatsWidget({ id: "stats" })]}` in:
  - `openspec/specs/nextjs-airports-example/spec.md`
  - `openspec/specs/react-router-airports-example/spec.md`
  - `openspec/specs/tanstack-start-airports-example/spec.md`
  - `openspec/specs/vite-airports-example/spec.md`
- No obvious `<widget>` primitive was found in searched renderer code under `packages/*`.

### 2. The original wording around positioned render callbacks was unclear

Reviewer comment on `design.md`:
- "What does this mean?"

Follow-up comment after clarification:
- "Ah, I didn't know this was called a positioned render callback"

Relevant original line in `design.md`:
- `Positioned render callbacks: {({viewport}) => <div>...</div>}`

Implication for next pass:
- Use clearer language in proposal/design, e.g. say "children as a function render pattern from `@deck.gl/react`" before introducing the term "positioned render callback".
- If this remains a non-goal, the wording should explain the user-visible shape and why it is out of scope.

### 3. Layer coverage likely needs to be broader than the original design proposed

Reviewer comment on `design.md`:
- "It'll be important to have full coverable for a non-breaking migration. Perhaps we need more exports that mirror the official deck layer modules? e.g.

  `@deckgl-fiber-renderer/compat/layers`
  `@deckgl-fiber-renderer/compat/geo-layers`
  `@deckgl-fiber-renderer/compat/aggregation-layers`
  `@deckgl-fiber-renderer/compat/mesh-layers`

  Not every user needs all of them, but all are wrapped for an easy migration"

Implication for next pass:
- Revisit whether the compat surface should mirror official package/module boundaries instead of shipping a partial manually-curated list.
- The prior design's "start with 15-20 most common layers" may be too narrow for the stated migration goal.

Original design section that now looks suspect:
- `design.md` → Decision 2 → "Layer Coverage"
- Prior plan: start with `15-20` common layers and add more later.

## User-provided follow-up context to carry forward

### Widgets are intentionally deferred

User note for future dedicated flow:
- Proposed future API direction: `<widget widget={new Widget()} />`

This should NOT be planned into the current regenerated QRSPI pass, but it should be preserved as follow-up context for a later OpenSpec/QRSPI change.

Supporting docs gathered for that future change:
- Widgets overview: deck.gl documents widgets as ordinary `new Widget()` instances passed in `widgets: []`
- Stats widget example in React uses official `<DeckGL><StatsWidget /></DeckGL>` syntax, which is exactly the kind of compatibility question to defer
- Widget styling docs show widgets are themed and styled globally/per-instance via CSS variables and class names

## Relevant codebase context for later review

### Native renderer patterns already present

- Layers are passed as instances:
  - `packages/reconciler/src/config.ts`
  - examples in comments show `<layer layer={new ScatterplotLayer({ id: "points", ... })} />`
- Views are passed as instances:
  - `packages/types/src/jsx.ts`
  - `openspec/specs/view-element/spec.md`
- `interleaved` is an existing integration mode:
  - `packages/dom/src/components.tsx`
  - `packages/reconciler/src/config.ts`
  - `packages/reconciler/src/renderer.ts`

### Existing docs/specs showing current widget story

- Widget usage is currently prop-based, not JSX-based:
  - `openspec/specs/nextjs-airports-example/spec.md`
  - `openspec/specs/react-router-airports-example/spec.md`
  - `openspec/specs/tanstack-start-airports-example/spec.md`
  - `openspec/specs/vite-airports-example/spec.md`
- Example requirement text includes `widgets={[new StatsWidget({ id: "stats" })]}` rather than child components.

## Open questions to answer in the fresh QRSPI cycle

1. If widgets are removed from scope, what is the smallest compatibility surface that still makes migration materially easier?
2. Does the migration goal require module-path compatibility that mirrors official deck.gl layer packages?
3. How many layer/view wrappers are required for the change to honestly claim "minimal code changes" during migration?
4. Should `/compat` export one flat entrypoint, mirrored subpath entrypoints, or both?
5. Which official `@deck.gl/react` patterns are explicitly in scope vs intentionally excluded, stated in user-facing language?
6. How should non-goals be phrased so they are understandable without prior deck.gl terminology?
7. Is there already enough internal extension/catalogue machinery to avoid manually authoring dozens of wrappers, or is codegen/exports generation required?
8. How should migration documentation distinguish:
   - supported now
   - deferred to future change
   - intentionally unsupported
9. If JSX widget syntax is deferred, should this change mention the future direction at all, or omit it entirely to avoid implied commitment?
10. Does the existing change still deserve the same slug/scope (`deckgl-react-compat`), or has the PR feedback narrowed it to a more specific compatibility slice?

## Deferred follow-up topic (explicitly not in scope here)

Potential future change:
- Widget primitive / JSX widget compatibility, possibly via:
  - `<widget widget={new Widget()} />`

Keep for later because:
- reviewer prefers dropping widget wrappers/hooks from this change
- user explicitly requested a separate future QRSPI flow for widgets
