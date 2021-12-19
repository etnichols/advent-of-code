import fs from 'fs'
import readline from 'readline'

const SEGMENT_ARRAY = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

const UNIQUE_LENGTHS_TO_NUMBER = new Map([
  [2, '1'],
  [3, '7'],
  [4, '4'],
  [7, '8'],
])

const PATTERN_TO_NUMBER = new Map([
  ['abcefg', '0'],
  ['cf', '1'],
  ['acdeg', '2'],
  ['acdfg', '3'],
  ['bcdf', '4'],
  ['abdfg', '5'],
  ['abdefg', '6'],
  ['acf', '7'],
  ['abcdefg', '8'],
  ['abcdfg', '9'],
])

const processLines = async () => {
  const filestream = fs.createReadStream(`./input.txt`)
  const rl = readline.createInterface({
    input: filestream,
    crlfDelay: Infinity,
  })

  let sum = 0

  for await (const line of rl) {
    let [input, output] = line
      .split(' | ')
      .map((piece) => piece.split(' ').map((sequence) => sequence.split('')))
    input.sort((a, b) => a.length - b.length)

    const decoder = new Map()
    const mustBeA = solveForA(input[0], input[1])
    decoder.set(mustBeA, 'a')

    let segmentTracker = {}
    SEGMENT_ARRAY.forEach((char) => {
      segmentTracker[char] = 0
    })

    input.forEach((pattern) => {
      pattern.forEach((character) => {
        // Skip segment A mapping, to maintain unique count for segment C.
        if (character !== mustBeA) {
          segmentTracker[character]++
        }
      })
    })

    // Use unique segment counts to identify mappings.
    for (const [char, count] of Object.entries(segmentTracker)) {
      switch (count) {
        case 6:
          decoder.set(char, 'b')
          break
        case 8:
          decoder.set(char, 'c')
          break
        case 4:
          decoder.set(char, 'e')
          break
        case 9:
          decoder.set(char, 'f')
          break
      }
    }

    // Solve D and G by process of elimination. Get pattern with length four.
    // The only unsolved character here must map to segment D.
    const mustBeD = getOnlyElement(
      input[2].filter((character) => decoder.get(character) === undefined)
    )
    decoder.set(mustBeD, 'd')
    const mustBeG = getOnlyElement(
      SEGMENT_ARRAY.filter((character) => decoder.get(character) === undefined)
    )
    decoder.set(mustBeG, 'g')

    // Verify.
    if (decoder.size !== 7) {
      throw new Error('Decoder not complete')
    }

    const decoded = output
      .map(
        (pattern) =>
          UNIQUE_LENGTHS_TO_NUMBER.get(pattern.length) ||
          PATTERN_TO_NUMBER.get(
            pattern
              .map((character) => decoder.get(character))
              .sort()
              .join('')
          )
      )
      .join('')

    sum += parseInt(decodedNumber, 10)
  }

  console.log('Sum: ', sum)
}

// A can always be solved using array corresponding to number 1 (length 2)
// and number 7 (length 3), as they share 2/3 segments. "Odd one out" must be segment A.
const solveForA = (mustBeOne, mustBeSeven) => {
  if (mustBeOne.length !== 2)
    throw new Error('Expected one of length two but got: ', mustBeOne)
  if (mustBeSeven.length !== 3)
    throw new Error('Expected seven of length three but got: ', mustBeSeven)
  return mustBeSeven.filter((char) => !mustBeOne.includes(char))[0]
}

const getOnlyElement = (arr) => {
  if (arr.length !== 1) {
    throw new Error('More than one element in: ', arr)
  }
  return arr[0]
}

await processLines()
