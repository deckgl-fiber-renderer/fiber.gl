"use client";

import type { FallbackProps } from "react-error-boundary";

/**
 * Error boundary for airports layer
 */
export function AirportsLayerError({ error }: FallbackProps) {
	console.error("Failed to load airports layer:", error);
	return null;
}
