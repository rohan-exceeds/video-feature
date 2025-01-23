import React from "react"
import { interpolate, interpolateColors, useCurrentFrame } from "remotion"
import { AnnotationHandler } from "codehike/code"

export const block: AnnotationHandler = {
  name: "block",
  Block: ({ annotation, children }) => {
    const borderColor = annotation.query || "red"
    const parts = annotation.query.split(",")

    const delay = +parts[0] || 80
    const duration = +parts[1] || 20
    const color = parts[2] || "#ec489944"

    const frame = useCurrentFrame()
    const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })

    const backgroundColor = interpolateColors(
      progress,
      [0, 1],
      ["rgba(0, 0, 0, 0)", color]
    )
    return (
      <div
        style={{
          backgroundColor,
        }}
      >
        {children}
      </div>
    )
  },
}
