import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import { NewSyntaxExample } from "./new-syntax";
import { OldSyntaxExample } from "./old-syntax";
import { SideBySideExample } from "./side-by-side";
import { UpdateTriggersExample } from "./update-triggers";

type Example = "old" | "new" | "side-by-side" | "update-triggers";

function App() {
  const [activeExample, setActiveExample] = useState<Example>("new");

  return (
    <div style={{ height: "100vh", position: "relative", width: "100vw" }}>
      <nav
        style={{
          alignItems: "center",
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          gap: "10px",
          left: 0,
          padding: "10px 20px",
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 10,
        }}
      >
        <h1 style={{ color: "white", fontSize: "18px", margin: 0 }}>
          Migration Examples
        </h1>
        <button
          onClick={() => setActiveExample("old")}
          style={{
            background: activeExample === "old" ? "#007bff" : "#444",
            border: "none",
            borderRadius: "4px",
            color: "white",
            cursor: "pointer",
            padding: "8px 16px",
          }}
        >
          Old Syntax (v1)
        </button>
        <button
          onClick={() => setActiveExample("new")}
          style={{
            background: activeExample === "new" ? "#007bff" : "#444",
            border: "none",
            borderRadius: "4px",
            color: "white",
            cursor: "pointer",
            padding: "8px 16px",
          }}
        >
          New Syntax (v2+)
        </button>
        <button
          onClick={() => setActiveExample("side-by-side")}
          style={{
            background: activeExample === "side-by-side" ? "#007bff" : "#444",
            border: "none",
            borderRadius: "4px",
            color: "white",
            cursor: "pointer",
            padding: "8px 16px",
          }}
        >
          Side-by-Side
        </button>
        <button
          onClick={() => setActiveExample("update-triggers")}
          style={{
            background:
              activeExample === "update-triggers" ? "#007bff" : "#444",
            border: "none",
            borderRadius: "4px",
            color: "white",
            cursor: "pointer",
            padding: "8px 16px",
          }}
        >
          UpdateTriggers
        </button>
      </nav>

      <div style={{ height: "100%", paddingTop: "60px", width: "100%" }}>
        {activeExample === "old" && <OldSyntaxExample />}
        {activeExample === "new" && <NewSyntaxExample />}
        {activeExample === "side-by-side" && <SideBySideExample />}
        {activeExample === "update-triggers" && <UpdateTriggersExample />}
      </div>
    </div>
  );
}

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
