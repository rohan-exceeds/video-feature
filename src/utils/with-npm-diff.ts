import { diffLines, Change } from 'diff';
import { oldCode as testOldCode, newCode as testNewCode } from './old-new-code-test-vars';

interface DiffOptions {
  oldFileName?: string;
  newFileName?: string;
}


export function generateDiffLines(
  oldStr: string,
  newStr: string,
  options: DiffOptions = {}
) {
  return diffLines(
    oldStr,
    newStr,
  );
}


const diff = generateDiffLines(testOldCode, testNewCode);

let scenes: String[][] = []

function generateRemoveScene(diff: Change[], removedIndex: number) {
  let sceneToAdd: String[] = []
  diff.forEach((entry, index) => {
    if(entry.added === true){
      return;
    }else{
      if(index === removedIndex){
        sceneToAdd.push(`// !focus(1:${entry.count}) \n// !mark(1:${entry.count})`)
        sceneToAdd.push(entry.value)
      }else{
        sceneToAdd.push(entry.value)
      }
    }
  });
  return sceneToAdd
}

function generateAddedScene(diff: Change[], addedIndex: number) {
  let sceneToAdd: String[] = []
  diff.forEach((entry, index) => {
    if(entry.removed === true){
      return;
    }else{
      if(index === addedIndex){
        sceneToAdd.push(`// !focus(1:${entry.count}) \n// !block(1:${entry.count}) 0,3,teal`)
        sceneToAdd.push(entry.value)
      }else{
        sceneToAdd.push(entry.value)
      }
    }
  });
  return sceneToAdd
}

for (let i = 0; i < diff.length; i++) {
  // Removed Block
  if(diff[i].added === false && diff[i].removed === true){
    const scene = generateRemoveScene(diff, i);
    scenes.push(scene)
  }

    // Added Block
  if(diff[i].added === true && diff[i].removed === false){
    const scene = generateAddedScene(diff, i);
    scenes.push(scene)
  }
}

let contentMd: String[] = []

for (let i = 0; i < scenes.length; i++) {
  if(i===0){
    const beforeCodeScene = `## !!steps ${"before"}\n` +
			"\n" +
			"!duration 400\n" +
			"\n" +
			"```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx\n" +
			`${testOldCode}\n` +
			"```\n" +
			"\n" ;

    contentMd.push(beforeCodeScene)
  }
  const step = `## !!steps ${i}\n` +
			"\n" +
			"!duration 250\n" +
			"\n" +
			"```jsx ! src/components/PackageCreator/CodeContributionDraft.tsx\n" +
			`${scenes[i].join('\n')}\n` +
			"```\n" +
			"\n" ;
  contentMd.push(step)
}
const fs = require('fs');
fs.writeFileSync(`content.md`, contentMd.join('\n'), 'utf8');
console.log("Done!");