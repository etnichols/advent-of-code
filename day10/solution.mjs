import fs from 'fs'
import readline from 'readline'

const OPENING_CHARS = new Set(['(', '[', '{', '<'])
const CLOSING_CHARS = new Set([')', ']', '}', '>'])
const OPEN_TO_CLOSE_MAP = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
}
const SYNTAX_SCORE_TABLE = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}
const AUTOCOMPLETE_SCORE_TABLE = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

async function processLinesPartOne() {
  const filestream = fs.createReadStream(`./input.txt`)
  const rl = readline.createInterface({
    input: filestream,
    crlfDelay: Infinity,
  })

  const corruptedMap = {
    ')': 0,
    ']': 0,
    '}': 0,
    '>': 0,
  }

  for await (const line of rl) {
    const sequence = line.split('')
    const corrupted = validate(sequence)
    if (corrupted) {
      corruptedMap[corrupted]++
    }
  }

  let score = 0
  for (const [character, count] of Object.entries(corruptedMap)) {
    score += SYNTAX_SCORE_TABLE[character] * count
  }

  console.log('Syntax error score: ' + score)
}

function validate(sequence) {
  let mutableSequence = sequence.slice()
  let stack = []

  let char = mutableSequence.shift()
  while (!!char) {
    if (OPENING_CHARS.has(char)) {
      stack.push(char)
      char = mutableSequence.shift()
      continue
    }

    if (CLOSING_CHARS.has(char)) {
      if (!stack.length) {
        console.log(`Got ${char} but matching stack is empty. Incomplete`)
        return null
      }

      let toMatch = stack.pop()
      const expected = OPEN_TO_CLOSE_MAP[toMatch]

      if (char !== expected) {
        console.log(`Expected ${expected}, but got ${char}`)
        return char
      }
    }

    // When sequence is exhausted, shift returns undefined.
    char = mutableSequence.shift()
  }

  if (stack.length) {
    console.log(
      'Finished processing input but stack not empty (incomplete). Stack: ',
      stack
    )
    return null
  }

  console.log('Valid line: ', sequence)
}

async function processLinesPartTwo() {
  const filestream = fs.createReadStream(`./input.txt`)
  const rl = readline.createInterface({
    input: filestream,
    crlfDelay: Infinity,
  })

  let scores = []

  for await (const line of rl) {
    const sequence = line.split('')
    const incomplete = getIncomplete(sequence)
    if (incomplete) {
      let score = 0
      let char = incomplete.pop()

      while (char) {
        score *= 5
        const closeMatch = OPEN_TO_CLOSE_MAP[char]
        score += AUTOCOMPLETE_SCORE_TABLE[closeMatch]

        char = incomplete.pop()
      }

      scores.push(score)
    }
  }

  scores.sort((a, b) => a - b)
  console.log('middle val: ', scores[Math.floor(scores.length / 2)])
}

// Returns the stack if the sequence is incomplete.
function getIncomplete(sequence) {
  let mutableSequence = sequence.slice()
  let stack = []
  let char = mutableSequence.shift()

  while (!!char) {
    if (OPENING_CHARS.has(char)) {
      stack.push(char)
      char = mutableSequence.shift()
      continue
    }

    if (CLOSING_CHARS.has(char)) {
      if (!stack.length) {
        console.log(`Got ${char} but matching stack is empty. Incomplete`)
        return null
      }

      let toMatch = stack.pop()
      const expected = OPEN_TO_CLOSE_MAP[toMatch]

      if (char !== expected) {
        console.log(`Expected ${expected}, but got ${char}`)
        return null
      }
    }

    // When sequence is exhausted, shift returns undefined.
    char = mutableSequence.shift()
  }

  if (stack.length) {
    console.log(
      'Finished processing input but stack not empty (incomplete). Stack: ',
      stack
    )
    return stack
  }

  console.log('Valid line: ', sequence)
  return null
}

processLinesPartOne()
processLinesPartTwo()
