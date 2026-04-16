import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Deckgl } from "../components";

// Mock the shared module for log
vi.mock(import("@deckgl-fiber-renderer/shared"), () => {
  // oxlint-disable-next-line vitest/require-mock-type-parameters
  const mockEnableLogging = vi.fn();
  // oxlint-disable-next-line vitest/require-mock-type-parameters
  const mockDisableLogging = vi.fn();

  return {
    log: {
      disableLogging: mockDisableLogging,
      enableLogging: mockEnableLogging,
    },
    mockDisableLogging,
    mockEnableLogging,
  };
});

// Mock the reconciler module
vi.mock(import("@deckgl-fiber-renderer/reconciler"), () => {
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

  return {
    createRoot: mockCreateRoot,
    mockConfigure,
    mockCreateRoot,
    mockRender,
    mockRoots,
    mockUnmountAtNode,
    roots: mockRoots,
    unmountAtNode: mockUnmountAtNode,
  };
});

// Get the mocks after they've been set up
const { mockRender, mockConfigure, mockCreateRoot, mockUnmountAtNode, mockRoots } =
  (await import("@deckgl-fiber-renderer/reconciler")) as unknown as {
    mockRender: ReturnType<typeof vi.fn>;
    mockConfigure: ReturnType<typeof vi.fn>;
    mockCreateRoot: ReturnType<typeof vi.fn>;
    mockUnmountAtNode: ReturnType<typeof vi.fn>;
    mockRoots: Map<unknown, unknown>;
  };

const { mockEnableLogging, mockDisableLogging } =
  (await import("@deckgl-fiber-renderer/shared")) as unknown as {
    mockEnableLogging: ReturnType<typeof vi.fn>;
    mockDisableLogging: ReturnType<typeof vi.fn>;
  };

describe("Deckgl Component Tests", () => {
  beforeEach(() => {
    // Only clear custom state not handled by global config
    mockRoots.clear();
  });

  it("should create reconciler root on mount", () => {
    // Act
    render(
      <Deckgl>
        <div>Test content</div>
      </Deckgl>,
    );

    // Assert
    expect(mockCreateRoot).toHaveBeenCalledWith(expect.any(HTMLCanvasElement));
  });

  it("should pass props to root.configure", () => {
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
      </Deckgl>,
    );

    // Assert
    expect(mockConfigure).toHaveBeenCalledWith(
      expect.objectContaining({
        initialViewState: props.initialViewState,
      }),
    );
  });

  it("should render canvas in standalone mode", () => {
    // Act
    render(
      <Deckgl>
        <div>Content</div>
      </Deckgl>,
    );

    // Assert
    const canvas = document.querySelector("#deckgl-fiber-canvas");
    expect(canvas).toBeInstanceOf(HTMLCanvasElement);
    expect(canvas?.tagName).toBe("CANVAS");
  });

  it("should render hidden div in interleaved mode", () => {
    // Act
    render(
      <Deckgl interleaved>
        <div>Content</div>
      </Deckgl>,
    );

    // Assert
    const interleaveDiv = document.querySelector("#deckgl-fiber-interleave");
    expect(interleaveDiv).toBeInstanceOf(HTMLDivElement);
    expect(interleaveDiv?.hasAttribute("hidden")).toBeTruthy();
  });

  it("should unmount cleanly", () => {
    // Arrange
    const { unmount } = render(
      <Deckgl>
        <div>Test</div>
      </Deckgl>,
    );

    // Act
    unmount();

    // Assert
    expect(mockUnmountAtNode).toHaveBeenCalledWith(expect.any(HTMLCanvasElement));
  });

  it("should unmount cleanly in interleaved mode", () => {
    // Arrange
    const { unmount } = render(
      <Deckgl interleaved>
        <div>Test</div>
      </Deckgl>,
    );

    // Act
    unmount();

    // Assert
    expect(mockUnmountAtNode).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("should enable logging when debug prop is true", () => {
    // Act
    render(
      <Deckgl debug>
        <div>Test</div>
      </Deckgl>,
    );

    // Assert
    expect(mockEnableLogging).toHaveBeenCalledWith();
  });

  it("should disable logging when debug prop is false", () => {
    // Act
    render(
      <Deckgl debug={false}>
        <div>Test</div>
      </Deckgl>,
    );

    // Assert
    expect(mockDisableLogging).toHaveBeenCalledWith();
  });

  it("should handle children updates", () => {
    // Arrange
    const { rerender } = render(
      <Deckgl>
        <div>Initial</div>
      </Deckgl>,
    );

    // Act - Update children
    rerender(
      <Deckgl>
        <div>Updated</div>
      </Deckgl>,
    );

    // Assert - Should call render again with new children
    expect(mockRender).toHaveBeenCalledTimes(2);
  });

  it("should handle prop updates without debug", () => {
    // Arrange
    const { rerender } = render(
      <Deckgl initialViewState={{ latitude: 0, longitude: 0, zoom: 1 }}>
        <div>Test</div>
      </Deckgl>,
    );

    // Act - Update props
    rerender(
      <Deckgl initialViewState={{ latitude: 10, longitude: 10, zoom: 2 }}>
        <div>Test</div>
      </Deckgl>,
    );

    // Assert - Should call configure with updated props
    expect(mockConfigure).toHaveBeenCalledWith(
      expect.objectContaining({
        initialViewState: { latitude: 10, longitude: 10, zoom: 2 },
      }),
    );
  });

  it("should toggle debug mode", () => {
    // Arrange
    const { rerender } = render(
      <Deckgl debug={false}>
        <div>Test</div>
      </Deckgl>,
    );

    // Act - Toggle debug to true
    rerender(
      <Deckgl debug>
        <div>Test</div>
      </Deckgl>,
    );

    // Assert - Should enable logging
    expect(mockEnableLogging).toHaveBeenCalledWith();
  });
});
