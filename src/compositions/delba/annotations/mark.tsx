import React from "react"
import { interpolate, interpolateColors, useCurrentFrame } from "remotion"
import { AnnotationHandler, InnerLine } from "codehike/code"

// export const mark: AnnotationHandler = {
//   name: "mark",
//   Inline: ({ children, annotation }) => {
//     const parts = annotation.query.split(" ")

//     const delay = +parts[0] || 80
//     const duration = +parts[1] || 20
//     const color = parts[2] || "#ec489944"

//     const frame = useCurrentFrame()
//     const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
//       extrapolateLeft: "clamp",
//       extrapolateRight: "clamp",
//     })

//     const backgroundColor = interpolateColors(
//       progress,
//       [0, 1],
//       ["rgba(0, 0, 0, 0)", color]
//     )
//     return (
//       <div
//         style={{
//           display: "inline-block",
//           backgroundColor,
//           borderRadius: 4,
//           padding: "0 .125rem",
//           margin: "0 -.125rem",
//         }}
//       >
//         {children}
//       </div>
//     )
//   },
// }

export const mark: AnnotationHandler = {
  name: "mark",
  Line: ({ annotation, ...props }) => {
    const color = annotation?.query || "rgb(14 165 233)"
    return (
      <div
        className="..."
        style={{
          borderLeft: "solid 2px transparent",
          borderLeftColor: annotation && color,
          backgroundColor: annotation && `rgb(from ${color} r g b / 0.1)`,
        }}
      >
        <InnerLine merge={props} className="..." />
      </div>
    )
  },
  Inline: ({ annotation, children }) => {
    const color = annotation?.query || "rgb(14 165 233)"
    return (
      <span
        className="..."
        style={{
          outline: `solid 1px rgb(from ${color} r g b / 0.5)`,
          background: `rgb(from ${color} r g b / 0.13)`,
        }}
      >
        {children}
      </span>
    )
  },
}