## 1. Update DeckglComponent Implementation

- [x] 1.1 Modify `useMemo` in `packages/dom/src/components.tsx` to exclude canvas and parent refs (change from spreading refs conditionally to just returning props directly)
- [x] 1.2 Update `useIsomorphicLayoutEffect` to spread canvas and parent refs inline when calling `root.configure()`
- [x] 1.3 Run `pnpm run lint` and `pnpm run format` to ensure code quality

## 2. Testing

- [x] 2.1 Add test case in `packages/dom/src/__tests__/deckgl-component.test.tsx` to verify single canvas element is created in standalone mode
- [x] 2.2 Add test case to verify canvas ref is properly passed to Deck.gl constructor
- [x] 2.3 Run existing tests with `pnpm --filter=@deckgl-fiber-renderer/dom test` to ensure no regressions
- [x] 2.4 Manually verify fix by running an example app and inspecting DOM for single canvas element

## 3. Documentation

- [x] 3.1 Add changeset with `pnpm changeset` describing the bug fix
- [x] 3.2 Update CHANGELOG if needed (changesets handles this automatically)
