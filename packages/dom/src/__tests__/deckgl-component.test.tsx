import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Deckgl } from "../components";

// Mock the reconciler module
const mockRender = vi.fn();
const mockConfigure = vi.fn();
const mockCreateRoot = vi.fn(() => ({
  configure: mockConfigure,
  render: mockRender,
  store: {
    getState: vi.fn(),
    setState: vi.fn(),
    subscribe: vi.fn(),
  },
}));
const mockUnmountAtNode = vi.fn();
const mockRoots = new Map();

vi.mock("@deckgl-fiber-renderer/reconciler", () => ({
  createRoot: mockCreateRoot,
  roots: mockRoots,
  unmountAtNode: mockUnmountAtNode,
}));

describe("Deckgl Component Tests", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    mockRoots.clear();
  });

  afterEach(() => {
    // Cleanup after each test
    vi.clearAllMocks();
  });

  it("should creates reconciler root on mount", () => {
    // Act
    render(
      <Deckgl>
        <div>Test content</div>
      </Deckgl>
    );

    // Assert
    expect(mockCreateRoot).toHaveBeenCalled();
  });

  it("should passes props to root.configure", () => {
    // Arrange
    const props = {
      initialViewState: {
        latitude: 0,
        longitude: 0,
        zoom: 1,
      },
    };

    // Act
    render(
      <Deckgl {...props}>
        <div>Test</div>
      </Deckgl>
    );

    // Assert
    expect(mockConfigure).toHaveBeenCalledWith(
      expect.objectContaining({
        initialViewState: props.initialViewState,
      })
    );
  });

  it("should renders canvas in standalone mode (follow accelint-react-testing query priority: getByRole > getByLabelText > getByText)", () => {
    // Act
    render(
      <Deckgl>
        <div>Content</div>
      </Deckgl>
    );

    // Assert - Query by element presence (canvas doesn't have role by default)
    const canvas = document.querySelector("#deckgl-fiber-canvas");
    expect(canvas).toBeTruthy();
    expect(canvas?.tagName).toBe("CANVAS");
  });

  it("should renders hidden div in interleaved mode", () => {
    // Act
    render(
      <Deckgl interleaved>
        <div>Content</div>
      </Deckgl>
    );

    // Assert - Check that interleave div is rendered with hidden attribute
    const interleaveDiv = document.querySelector("#deckgl-fiber-interleave");
    expect(interleaveDiv).toBeTruthy();
    expect(interleaveDiv?.hasAttribute("hidden")).toBe(true);
  });

  it("should unmounts cleanly", () => {
    // Arrange
    const { unmount } = render(
      <Deckgl>
        <div>Test</div>
      </Deckgl>
    );

    // Act
    unmount();

    // Assert
    expect(mockUnmountAtNode).toHaveBeenCalled();
  });
});
