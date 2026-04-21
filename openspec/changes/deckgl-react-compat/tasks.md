## 1. Setup and Infrastructure

- [ ] 1.1 Create `/compat` directory structure under `packages/dom/src/`
- [ ] 1.2 Update `packages/dom/package.json` exports field to include `./compat` entry point
- [ ] 1.3 Add `@deck.gl/widgets` to peerDependencies in `packages/dom/package.json`
- [ ] 1.4 Create `packages/dom/src/compat/index.ts` with placeholder exports
- [ ] 1.5 Verify tsdown builds `/compat` entry point correctly

## 2. Type Definitions

- [ ] 2.1 Create `packages/dom/src/compat/types.ts` with DeckGLProps type (omitting unsupported props)
- [ ] 2.2 Add DeckGLRef type with deck property and picking methods
- [ ] 2.3 Add DeckGLContextValue type matching official API shape
- [ ] 2.4 Add LayerProps<T> generic type for layer wrapper props
- [ ] 2.5 Add ViewProps<T> generic type for view wrapper props
- [ ] 2.6 Export all types from `packages/dom/src/compat/index.ts`
- [ ] 2.7 Write type tests in `packages/dom/src/compat/__tests__/types.test-d.ts`

## 3. DeckGLContext Implementation

- [ ] 3.1 Create `packages/dom/src/compat/context.ts` with DeckGLContext creation
- [ ] 3.2 Implement CompatContextProvider component that reads from useDeckgl hook
- [ ] 3.3 Add memoization for context value to prevent unnecessary re-renders
- [ ] 3.4 Support custom ContextProvider prop
- [ ] 3.5 Write unit tests for context in `packages/dom/src/compat/__tests__/context.test.tsx`
- [ ] 3.6 Export DeckGLContext and CompatContextProvider from index

## 4. Layer Wrapper Components

- [ ] 4.1 Create `packages/dom/src/compat/layers.tsx` file
- [ ] 4.2 Implement ScatterplotLayer wrapper component
- [ ] 4.3 Implement ArcLayer wrapper component
- [ ] 4.4 Implement LineLayer wrapper component
- [ ] 4.5 Implement GeoJsonLayer wrapper component
- [ ] 4.6 Implement PolygonLayer wrapper component
- [ ] 4.7 Implement PathLayer wrapper component
- [ ] 4.8 Implement IconLayer wrapper component
- [ ] 4.9 Implement TextLayer wrapper component
- [ ] 4.10 Implement ColumnLayer wrapper component
- [ ] 4.11 Implement GridCellLayer wrapper component
- [ ] 4.12 Implement PointCloudLayer wrapper component
- [ ] 4.13 Implement BitmapLayer wrapper component
- [ ] 4.14 Implement SolidPolygonLayer wrapper component
- [ ] 4.15 Implement H3HexagonLayer wrapper component (geo-layers)
- [ ] 4.16 Implement S2Layer wrapper component (geo-layers)
- [ ] 4.17 Implement GreatCircleLayer wrapper component (geo-layers)
- [ ] 4.18 Implement TileLayer wrapper component (geo-layers)
- [ ] 4.19 Implement MVTLayer wrapper component (geo-layers)
- [ ] 4.20 Export all layer wrappers from index
- [ ] 4.21 Write integration tests for layer wrappers in `__tests__/layers.test.tsx`

## 5. View Wrapper Components

- [ ] 5.1 Create `packages/dom/src/compat/views.tsx` file
- [ ] 5.2 Implement MapView wrapper component
- [ ] 5.3 Implement FirstPersonView wrapper component
- [ ] 5.4 Implement OrthographicView wrapper component
- [ ] 5.5 Implement OrbitView wrapper component
- [ ] 5.6 Add development mode warning for missing view IDs
- [ ] 5.7 Export all view wrappers from index
- [ ] 5.8 Write integration tests for view wrappers in `__tests__/views.test.tsx`

## 6. DeckGL Component Implementation

- [ ] 6.1 Create `packages/dom/src/compat/deckgl.tsx` file
- [ ] 6.2 Implement DeckGL component with forwardRef
- [ ] 6.3 Integrate CompatContextProvider to wrap children
- [ ] 6.4 Implement useImperativeHandle for ref methods (pickObject, pickObjects, etc.)
- [ ] 6.5 Add development mode warnings for unsupported props (Deck, _customRender)
- [ ] 6.6 Pass all children directly to underlying Deckgl (reconciler handles layer/view extraction)
- [ ] 6.7 Handle width/height/style props correctly
- [ ] 6.8 Export DeckGL as named and default export from index
- [ ] 6.9 Write unit tests for DeckGL component in `__tests__/deckgl.test.tsx`

## 7. useWidget Hook Implementation

- [ ] 7.1 Create `packages/dom/src/compat/use-widget.ts` file
- [ ] 7.2 Implement useWidget hook with generic type parameters
- [ ] 7.3 Add widget instance creation and persistence via useRef
- [ ] 7.4 Implement widget props update via useEffect
- [ ] 7.5 Implement widget addition to deck on mount
- [ ] 7.6 Implement widget removal from deck on unmount
- [ ] 7.7 Read deck instance from useDeckgl hook
- [ ] 7.8 Return widget instance for imperative access
- [ ] 7.9 Export useWidget from index
- [ ] 7.10 Write unit tests for useWidget in `__tests__/use-widget.test.tsx`

## 8. Testing

- [ ] 8.1 Write integration test: basic DeckGL with layers prop
- [ ] 8.2 Write integration test: DeckGL with JSX layers
- [ ] 8.3 Write integration test: DeckGL with JSX views
- [ ] 8.4 Write integration test: ref methods (pickObject, pickObjects, etc.)
- [ ] 8.5 Write integration test: DeckGLContext access in child components
- [ ] 8.6 Write integration test: useWidget hook with ZoomWidget example
- [ ] 8.7 Write integration test: mix of layers prop and JSX layers
- [ ] 8.8 Write integration test: custom ContextProvider prop
- [ ] 8.9 Write integration test: width/height/style props
- [ ] 8.10 Verify all tests pass with `pnpm --filter=@deckgl-fiber-renderer/dom test`

## 9. Documentation

- [ ] 9.1 Create migration guide from `@deck.gl/react` to `/compat`
- [ ] 9.2 Document API compatibility matrix (what works/differs/doesn't work)
- [ ] 9.3 Create cookbook for implementing custom widget components
- [ ] 9.4 Document how to create wrappers for missing layers
- [ ] 9.5 Document known limitations and workarounds
- [ ] 9.6 Add JSDoc comments to all exported types and functions
- [ ] 9.7 Create example showing migration from official to compat to native API

## 10. Build and Quality Checks

- [ ] 10.1 Run `pnpm --filter=@deckgl-fiber-renderer/dom build` and verify `/compat` dist files
- [ ] 10.2 Run `pnpm --filter=@deckgl-fiber-renderer/dom lint` and fix any issues
- [ ] 10.3 Run `pnpm --filter=@deckgl-fiber-renderer/dom format` to format code
- [ ] 10.4 Verify type definitions are exported correctly in dist
- [ ] 10.5 Check bundle size impact of `/compat` entry point
- [ ] 10.6 Verify tree-shaking works (compat not included when not imported)

## 11. Final Integration

- [ ] 11.1 Create example app in `examples/` directory using `/compat` API
- [ ] 11.2 Manually test all layer wrapper components in example app
- [ ] 11.3 Manually test all view wrapper components in example app
- [ ] 11.4 Manually test ref methods in example app
- [ ] 11.5 Manually test useWidget with multiple widgets in example app
- [ ] 11.6 Test in development mode to verify warnings appear correctly
- [ ] 11.7 Test in production build to verify no warnings
- [ ] 11.8 Generate changeset with `pnpm changeset` (minor version bump)
