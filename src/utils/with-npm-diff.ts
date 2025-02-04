import { diffLines, Change } from "diff"
import {
  oldCode1 as testOldCode1,
  newCode1 as testNewCode1,
  oldCode2 as testOldCode2,
  newCode2 as testNewCode2,
  fileName1 as testFileName1,
  fileName2 as testFileName2,
} from "./old-new-code-test-vars"
const fs = require("fs")



interface DiffOptions {
  oldFileName?: string
  newFileName?: string
}

type DiffScene = {
  duration: number,
  scene: string[]
}

/**
 * Generates diff lines between two strings using the diff library
 * @param oldStr - Original string content
 * @param newStr - New string content
 * @param options - Optional configuration for diff generation
 */
export function generateDiffLines(
  oldStr: string,
  newStr: string,
  options: DiffOptions = {}
): Change[] {
  return diffLines(oldStr, newStr)
}

/**
 * Generates scenes showing only removed content with highlighting
 * @param diff - Array of diff changes
 * @param targetIndex - Index of the change to focus on
 * @returns Tuple of [beforeScene, afterScene]
 */
function generateRemovedOnlyScenes(diff: Change[], targetIndex: number): DiffScene[] {
  const beforeScene: string[] = []
  const afterScene: string[] = []

  // Generate before scene with highlighted removed content
  diff.forEach((entry, idx) => {
    if (idx === targetIndex) {
      beforeScene.push(`// !focus(1:13)\n// !mark(1:${entry.count}) red`)
      beforeScene.push(entry.value)
    } else {
      beforeScene.push(entry.value)
    }
  })

  // Generate after scene without the removed content
  diff.forEach((entry, idx) => {
    if (idx !== targetIndex) {
      afterScene.push(entry.value)
    }
  })

  const scneneGenerated = [
    {
      duration: 100,
      scene: beforeScene
    },
    {
      duration: 200,
      scene: afterScene
    }
  ]

  return scneneGenerated
}

/**
 * Generates scenes showing only added content with highlighting
 * @param diff - Array of diff changes
 * @param targetIndex - Index of the change to focus on
 * @returns Tuple of [beforeScene, afterScene]
 */
function generateAddedOnlyScenes(diff: Change[], targetIndex: number): DiffScene[] {
  const beforeScene: string[] = []
  const afterScene: string[] = []

  // Generate before scene without the added content
  diff.forEach((entry, idx) => {
    if (idx === targetIndex) {
      let focusStr = `// !focus(1:${entry.count})\n`
      if (entry.count && entry.count > 13) {
        focusStr = `// !focus(1:13)\n`
      }
      beforeScene.push(focusStr)
    } else {
      beforeScene.push(entry.value)
    }
  })

  // Generate after scene with highlighted added content
  diff.forEach((entry, idx) => {
    if (idx === targetIndex) {
      afterScene.push(`// !mark(1:${entry.count}) green`)
      afterScene.push(entry.value)
    } else {
      afterScene.push(entry.value)
    }
  })

  const scneneGenerated = [
    {
      duration: 100,
      scene: beforeScene
    },
    {
      duration: 200,
      scene: afterScene
    }
  ]

  return scneneGenerated
}

/**
 * Generates scenes showing both removed and added content with highlighting
 * @param diff - Array of diff changes
 * @param removedIndex - Index of the removed change
 * @param addedIndex - Index of the added change
 * @returns Tuple of [beforeScene, middleScene, afterScene]
 */
function generateRemovedAddedScenes(
  diff: Change[],
  removedIndex: number,
  addedIndex: number
): DiffScene[] {
  const beforeScene: string[] = []
  const middleScene: string[] = []
  const afterScene: string[] = []

  // Generate before scene with highlighted removed content
  diff.forEach((entry, idx) => {
    if (idx === removedIndex) {
      let focusStr = `// !focus(1:${entry.count})\n`
      if (entry.count && entry.count > 13) {
        focusStr = `// !focus(1:13)\n`
      }
      beforeScene.push(focusStr + `// !mark(1:${entry.count}) red`)
      beforeScene.push(entry.value)
    } else {
      if (idx < removedIndex) {
        // we dont include removed lines above the removed index
        if (entry.removed !== true) {
          beforeScene.push(entry.value)
        }
      } else if (idx > addedIndex) {
        // we include removed lines below the removed index
        if (entry.added !== true) {
          beforeScene.push(entry.value)
        }
      }
    }
  })

  // Generate middle scene without the removed and added content
  diff.forEach((entry, idx) => {
    if (idx === removedIndex || idx === addedIndex) {
      middleScene.push(`// !focus(1:${entry.count})`)
      return
    } else {
      if (idx < removedIndex) {
        // we dont include removed lines above the removed index
        if (entry.removed !== true) {
          middleScene.push(entry.value)
        }
      } else if (idx > addedIndex) {
        // we include removed lines below the added index
        if (entry.added !== true) {
          middleScene.push(entry.value)
        }
      }
    }
  })

  // Generate after scene with highlighted added content
  diff.forEach((entry, idx) => {
    if (idx === addedIndex) {
      afterScene.push(`// !mark(1:${entry.count}) green`)
      afterScene.push(entry.value)
    } else {
      if (idx < addedIndex) {
        // we dont include removed lines above the removed index
        if (entry.removed !== true) {
          afterScene.push(entry.value)
        }
      } else if (idx > removedIndex) {
        // we include removed lines below the removed index
        if (entry.added !== true) {
          afterScene.push(entry.value)
        }
      }
    }
  })

  const scneneGenerated = [
    {
      duration: 150,
      scene: beforeScene
    },
    {
      duration: 80,
      scene: middleScene
    },
    {
      duration: 200,
      scene: afterScene
    }
  ]

  return scneneGenerated
}


function generateDiffScenes(startIndex: number, endIndex: number, diff: Change[]) {
  let scenes: DiffScene[] = []

  for (let i = startIndex; i < endIndex; i++) {
    if (i === diff.length - 1) {
      if (diff[i].removed === true && diff[i - 1].removed === false) {
        const [before, after] = generateRemovedOnlyScenes(diff, i)
        scenes.push(before)
        scenes.push(after)
        continue
      } else if (diff[i].added === true && diff[i - 1].removed === false) {
        const [before, after] = generateAddedOnlyScenes(diff, i)
        scenes.push(before)
        scenes.push(after)
        continue
      }
    }
  
    if (i === 0) {
      if (diff[i].added === true && diff[i + 1].removed === false) {
        const [before, after] = generateAddedOnlyScenes(diff, i)
        scenes.push(before)
        scenes.push(after)
        continue
      }
  
      if (diff[i].removed === true && diff[i + 1].added === false) {
        const [before, after] = generateRemovedOnlyScenes(diff, i)
        scenes.push(before)
        scenes.push(after)
        continue
      }
    }
  
    if (diff[i].removed === true && diff[i + 1].added === false && diff[i - 1].added === false) {
      const [before, after] = generateRemovedOnlyScenes(diff, i)
      scenes.push(before)
      scenes.push(after)
      continue
    }
  
    if (diff[i].added === true && diff[i + 1].removed === false && diff[i - 1].removed === false) {
      const [before, after] = generateAddedOnlyScenes(diff, i)
      scenes.push(before)
      scenes.push(after)
      continue
    }
  
    if (diff[i].removed === true && diff[i + 1].added === true) {
      const [before, middle, after] = generateRemovedAddedScenes(diff, i, i + 1)
      scenes.push(before)
      scenes.push(middle)
      scenes.push(after)
      continue
    }
  }

  return scenes
}


const diffs = [{
  fileName: testFileName1,
  diff: generateDiffLines(testOldCode1, testNewCode1)
}, {
  fileName: testFileName2,
  diff: generateDiffLines(testOldCode2, testNewCode2)
}]



import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { systemPrompt } from "./test-prompts";



const model = new ChatOpenAI({
  apiKey: "git-prevent",
  modelName: "gpt-4o",
  temperature: 0,
}).bind({
  response_format: { type: "json_object" },
});

import { z } from "zod";

const codeReferenceSchema = z.object({
  filename: z.string(),
  start_line: z.number(),
  end_line: z.number()
});

const transcriptSegmentSchema = z.object({
  speaker_dialogue: z.string(),
  speaker_id: z.union([z.literal("1"), z.literal("2")]),
  timestamp_seconds: z.number(),
  code_reference: codeReferenceSchema
});

const transcriptSchema = z.object({
  transcript_segments: z.array(transcriptSegmentSchema)
});

// Bind schema to model
// const modelWithStructure = model.withStructuredOutput(transcriptSchema);

async function processAndGenerateResponse() {
  const messages = [
    new SystemMessage(systemPrompt),
  ];
  
  let humanMessage: string[] = []
  humanMessage.push("--------------------------------")
  humanMessage.push("Total Number of Files Changed in this commit :" + diffs.length)
  humanMessage.push("--------------------------------")
  for (let i = 0; i < diffs.length; i++) {
    const diff = diffs[i].diff
    let wholeCodeWithDiffs: string[] = []
    let lineNo = 1  // Track the current line number
    humanMessage.push("--------------------------------")
    humanMessage.push("File Number: " + (i + 1))
    humanMessage.push("File Name: " + diffs[i].fileName)



    for (let i = 0; i < diff.length; i++) {
      if (diff[i].removed === true && diff[i].added === false) {
        let splitValue = diff[i].value.split("\n")
        splitValue = splitValue.map(line => {
          return line.trim() ? `-  ${lineNo++}: ${line}` : line
        })
        wholeCodeWithDiffs.push(splitValue.join("\n"))
      } else if (diff[i].added === true && diff[i].removed === false) {
        let splitValue = diff[i].value.split("\n")
        splitValue = splitValue.map(line => {
          return line.trim() ? `+  ${lineNo++}: ${line}` : line
        })
        wholeCodeWithDiffs.push(splitValue.join("\n"))
      } else {
        let splitValue = diff[i].value.split("\n")
        splitValue = splitValue.map(line => {
          return line.trim() ? `   ${lineNo++}: ${line}` : line
        })
        wholeCodeWithDiffs.push(splitValue.join("\n"))
      }
    }

    humanMessage.push("File Diff:")
    humanMessage.push(wholeCodeWithDiffs.join("\n"))
    humanMessage.push("--------------------------------")
  
  }

  messages.push(new HumanMessage(humanMessage.join("\n")))
  // const aiResponse = await model.invoke(messages)

  const testOutput = "\n{\n  \"transcript_segments\": [\n    {\n      \"speaker_dialogue\": \"Hey there! Today, we're diving into a fascinating code commit that adds a bit of magic to our codebase. You know what's cool about this one? It's all about making our code more interactive and user-friendly.\",\n      \"speaker_id\": \"1\",\n      \"timestamp_seconds\": \"15\",\n      \"code_reference\": {\n        \"filename\": \"DraftComponents.tsx\",\n        \"start_line\": \"31\",\n        \"end_line\": \"50\"\n      }\n    },\n    {\n      \"speaker_dialogue\": \"Oh, interesting! So, what exactly did they change?\",\n      \"speaker_id\": \"2\",\n      \"timestamp_seconds\": \"5\",\n      \"code_reference\": {\n        \"filename\": \"DraftComponents.tsx\",\n        \"start_line\": \"31\",\n        \"end_line\": \"50\"\n      }\n    },\n    {\n      \"speaker_dialogue\": \"Well, they've added a nifty feature where the text fields in our 'Strengths' and 'Opportunities' sections are now editable only when you're in edit mode. It's like giving our users a special pen that only works when they're allowed to write.\",\n      \"speaker_id\": \"1\",\n      \"timestamp_seconds\": \"10\",\n      \"code_reference\": {\n        \"filename\": \"DraftComponents.tsx\",\n        \"start_line\": \"31\",\n        \"end_line\": \"50\"\n      }\n    },\n    {\n      \"speaker_dialogue\": \"Ah, so no more accidental edits when you're just browsing. That's a relief!\",\n      \"speaker_id\": \"2\",\n      \"timestamp_seconds\": \"5\",\n      \"code_reference\": {\n        \"filename\": \"DraftComponents.tsx\",\n        \"start_line\": \"31\",\n        \"end_line\": \"50\"\n      }\n    },\n    {\n      \"speaker_dialogue\": \"Exactly! And there's more. They've also introduced a function to replace hash codes with clickable URLs. Imagine turning those cryptic commit hashes into friendly links that take you straight to the details.\",\n      \"speaker_id\": \"1\",\n      \"timestamp_seconds\": \"10\",\n      \"code_reference\": {\n        \"filename\": \"CodeContributionDraft.tsx\",\n        \"start_line\": \"160\",\n        \"end_line\": \"206\"\n      }\n    },\n    {\n      \"speaker_dialogue\": \"Oh, that's like turning a treasure map into a GPS! No more guessing where the treasure is hidden.\",\n      \"speaker_id\": \"2\",\n      \"timestamp_seconds\": \"5\",\n      \"code_reference\": {\n        \"filename\": \"CodeContributionDraft.tsx\",\n        \"start_line\": \"160\",\n        \"end_line\": \"206\"\n      }\n    },\n    {\n      \"speaker_dialogue\": \"Exactly! This change not only makes navigation easier but also enhances the overall user experience by making the information more accessible.\",\n      \"speaker_id\": \"1\",\n      \"timestamp_seconds\": \"10\",\n      \"code_reference\": {\n        \"filename\": \"CodeContributionDraft.tsx\",\n        \"start_line\": \"160\",\n        \"end_line\": \"206\"\n      }\n    },\n    {\n      \"speaker_dialogue\": \"So, the takeaway here is that small changes can make a big difference in how users interact with our application. It's all about those little touches that make the experience smoother and more intuitive.\",\n      \"speaker_id\": \"1\",\n      \"timestamp_seconds\": \"10\",\n      \"code_reference\": {\n        \"filename\": \"DraftComponents.tsx\",\n        \"start_line\": \"31\",\n        \"end_line\": \"50\"\n      }\n    },\n    {\n      \"speaker_dialogue\": \"Absolutely! And who knew a bit of code could be so exciting?\",\n      \"speaker_id\": \"2\",\n      \"timestamp_seconds\": \"5\",\n      \"code_reference\": {\n        \"filename\": \"CodeContributionDraft.tsx\",\n        \"start_line\": \"160\",\n        \"end_line\": \"206\"\n      }\n    }\n  ]\n}"
  const jsonObject = JSON.parse(testOutput)
  // console.log(jsonObject)

  const transcriptSegments = jsonObject.transcript_segments

  const scenesToGenerate: DiffScene[] = []

  for(let i = 0; i < transcriptSegments.length; i++) {
    if(transcriptSegments[i].code_reference.filename === testFileName1) {
      let low = 0;
      let high = 0;
      let count = 0;
      for (let j = 0; j < diffs[0].diff.length; j++) {
        count += diffs[0].diff[j].count ?? 0
        if(count >= transcriptSegments[i].code_reference.start_line) {
          low = j;
          break;
        }
      }
      count = 0;
      for (let j = 0; j < diffs[0].diff.length; j++) {
        count += diffs[0].diff[j].count ?? 0
        if(count >= transcriptSegments[i].code_reference.end_line) {
          high = j;
          break;
        }
      }
      const generatedScenes = generateDiffScenes(low, high, diffs[0].diff)
      scenesToGenerate.push(...generatedScenes)
    }


    if(transcriptSegments[i].code_reference.filename === testFileName2) {
      let low = 0;
      let high = 0;
      let count = 0;
      for (let j = 0; j < diffs[0].diff.length; j++) {
        count += diffs[0].diff[j].count ?? 0
        if(count >= transcriptSegments[i].code_reference.start_line) {
          low = j;
          break;
        }
      }
      count = 0;
      for (let j = 0; j < diffs[0].diff.length; j++) {
        count += diffs[0].diff[j].count ?? 0
        if(count >= transcriptSegments[i].code_reference.end_line) {
          high = j;
          break;
        }
      }
      const generatedScenes = generateDiffScenes(low, high, diffs[0].diff)
      scenesToGenerate.push(...generatedScenes)
    }
  }

  console.log(scenesToGenerate)


  let contentMd: string[] = []
  
  for (let i = 0; i < scenesToGenerate.length; i++) {
    const step =
      `## !!steps ${i}\n` +
      "\n" +
      `!duration ${scenesToGenerate[i].duration}\n` +
      "\n" +
      "```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx\n" +
      `${scenesToGenerate[i].scene.join("\n")}\n` +
      "```\n" +
      "\n"
    contentMd.push(step)
  }
  
  
  fs.writeFileSync(`content.md`, contentMd.join("\n"), "utf8")
  console.log("Done!")
}

// Call the async function
processAndGenerateResponse().catch(error => {
  console.error('Error:', error)
})


  // for (let i = 0; i < diff.length; i++) {
  //   if (i === diff.length - 1) {
  //     if (diff[i].removed === true && diff[i - 1].removed === false) {
  //       const [before, after] = generateRemovedOnlyScenes(diff, i)
  //       scenes.push(before)
  //       scenes.push(after)
  //       continue
  //     } else if (diff[i].added === true && diff[i - 1].removed === false) {
  //       const [before, after] = generateAddedOnlyScenes(diff, i)
  //       scenes.push(before)
  //       scenes.push(after)
  //       continue
  //     }
  //   }
  
  //   if (i === 0) {
  //     if (diff[i].added === true && diff[i + 1].removed === false) {
  //       const [before, after] = generateAddedOnlyScenes(diff, i)
  //       scenes.push(before)
  //       scenes.push(after)
  //       continue
  //     }
  
  //     if (diff[i].removed === true && diff[i + 1].added === false) {
  //       const [before, after] = generateRemovedOnlyScenes(diff, i)
  //       scenes.push(before)
  //       scenes.push(after)
  //       continue
  //     }
  //   }
  
  //   if (diff[i].removed === true && diff[i + 1].added === false && diff[i - 1].added === false) {
  //     const [before, after] = generateRemovedOnlyScenes(diff, i)
  //     scenes.push(before)
  //     scenes.push(after)
  //     continue
  //   }
  
  //   if (diff[i].added === true && diff[i + 1].removed === false && diff[i - 1].removed === false) {
  //     const [before, after] = generateAddedOnlyScenes(diff, i)
  //     scenes.push(before)
  //     scenes.push(after)
  //     continue
  //   }
  
  //   if (diff[i].removed === true && diff[i + 1].added === true) {
  //     const [before, middle, after] = generateRemovedAddedScenes(diff, i, i + 1)
  //     scenes.push(before)
  //     scenes.push(middle)
  //     scenes.push(after)
  //     continue
  //   }
  // }
  
  // let contentMd: string[] = []
  
  // for (let i = 0; i < scenes.length; i++) {
  //   const step =
  //     `## !!steps ${i}\n` +
  //     "\n" +
  //     `!duration ${scenes[i].duration}\n` +
  //     "\n" +
  //     "```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx\n" +
  //     `${scenes[i].scene.join("\n")}\n` +
  //     "```\n" +
  //     "\n"
  //   contentMd.push(step)
  // }
  
  
  // fs.writeFileSync(`content.md`, contentMd.join("\n"), "utf8")
  // console.log("Done!")

// }




