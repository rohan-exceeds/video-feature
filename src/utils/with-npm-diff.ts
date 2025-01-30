import { diffLines, Change } from "diff"
import {
  oldCode as testOldCode,
  newCode as testNewCode,
} from "./old-new-code-test-vars"

interface DiffOptions {
  oldFileName?: string
  newFileName?: string
}

type DiffScene = string[]

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
function generateRemovedOnlyScenes(diff: Change[], targetIndex: number): [DiffScene, DiffScene] {
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

  return [beforeScene, afterScene]
}

/**
 * Generates scenes showing only added content with highlighting
 * @param diff - Array of diff changes
 * @param targetIndex - Index of the change to focus on
 * @returns Tuple of [beforeScene, afterScene]
 */
function generateAddedOnlyScenes(diff: Change[], targetIndex: number): [DiffScene, DiffScene] {
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

  return [beforeScene, afterScene]
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
): [DiffScene, DiffScene, DiffScene] {
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

  return [beforeScene, middleScene, afterScene]
}

const diff = generateDiffLines(testOldCode, testNewCode)
let scenes: DiffScene[] = []

for (let i = 0; i < diff.length; i++) {
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

let contentMd: string[] = []

for (let i = 0; i < scenes.length; i++) {
  const step =
    `## !!steps ${i}\n` +
    "\n" +
    "!duration 200\n" +
    "\n" +
    "```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx\n" +
    `${scenes[i].join("\n")}\n` +
    "```\n" +
    "\n"
  contentMd.push(step)
}

const fs = require("fs")
fs.writeFileSync(`content.md`, contentMd.join("\n"), "utf8")
console.log("Done!")
