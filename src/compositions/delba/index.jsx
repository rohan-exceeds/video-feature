import { Block, HighlightedCodeBlock, parseRoot } from "codehike/blocks"
import { z } from "zod"
import { AbsoluteFill, Composition, Sequence, useCurrentFrame  } from "remotion"
import React from "react"
import { ProgressBar } from "./progress-bar"
import { Code } from "./code"
import { linearTiming, TransitionSeries } from "@remotion/transitions";

import Content from "./content.md"
const { steps } = parseRoot(
  Content,
  Block.extend({
    steps: z.array(
      Block.extend({
        code: HighlightedCodeBlock,
        duration: z.string().transform((v) => parseInt(v, 10)),
      })
    ),
  })
)

export default function RemotionRoot() {
  const duration = steps.reduce((acc, step) => acc + step.duration, 0)
  // const frame = useCurrentFrame();
  return (
    <Composition
      id="Delba"
      component={Video}
      defaultProps={{ steps }}
      durationInFrames={duration}
      fps={30}
      width={1200}
      height={1080}
    />
  )
}

function Video({ steps }) {
  const frame = useCurrentFrame();
  let stepEnd = 0
  return (
    <AbsoluteFill style={{ backgroundColor: "#0D1117" }}>
      <ProgressBar steps={steps} />
      {steps.map((step, index) => {
        stepEnd += step.duration
        return (
          <Sequence
            frame={frame}
            key={index}
            from={stepEnd - step.duration}
            durationInFrames={step.duration}
            name={step.title}
            style={{ padding: "16px 42px" }}
          >
            <div style={{ overflow: "auto" }}>
              <Code
                oldCode={steps[index - 1]?.code}
                newCode={step.code}
                durationInFrames={step.duration}
              />
            </div>
          </Sequence>
        )
      })}
    </AbsoluteFill>
  )
}
