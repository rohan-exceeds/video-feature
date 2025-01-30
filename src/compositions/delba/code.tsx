import React from "react"
import { Pre, HighlightedCode, AnnotationHandler, BlockAnnotation, InnerLine } from "codehike/code"
import { loadFont } from "@remotion/google-fonts/RobotoMono"
import { tokenTransitions, useTokenTransitions } from "./token-transitions"
import { block } from "./annotations/block"
import { mark } from "./annotations/mark"
import { focus } from "./annotations/focus"
import { diff } from "./annotations/diff"

const { fontFamily } = loadFont()

export function Code({
  oldCode,
  newCode,
  durationInFrames = 30,
}: {
  oldCode?: HighlightedCode
  newCode: HighlightedCode
  durationInFrames?: number
}) {
  const { code, ref } = useTokenTransitions(oldCode, newCode, durationInFrames)

  return (
    <div
      style={{
        fontSize: 20,
        lineHeight: 1.6,
        fontFamily,
        color: "#fffa",
        width: "100%",
        maxHeight: "100%", // Allow layout to adapt to container
        display: "flex",
        flexDirection: "column",
        paddingRight: "30px",
        paddingLeft: "30px",
      }}
    >
      {/* Sticky Top Bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "#333", // Ensure contrast with text
          color: "#fff",
          padding: "10px",
          zIndex: 10, // Keep it above the scrollable content
        }}
      >
        {newCode.meta}
      </div>

      {/* Scrollable Code Container */}
      <div
        className="scrollable-container"
        style={{
          overflow: "auto",
          flex: 1, // Allow it to take the remaining space
          scrollbarGutter: "none", // Ensure no scrollbar gutter
        }}
      >
        <Pre
          ref={ref}
          code={code}
          handlers={[tokenTransitions, block, mark, focus, diff]} // Include focus handler
        />
      </div>
      <style>
        {`
        .scrollable-container::-webkit-scrollbar {
          display: none; /* Hide scrollbar for Webkit browsers */
        }
        `}
      </style>
    </div>
  )
}
