import fs from 'fs'
import readline from 'readline'

const processLines = async () => {
  const filestream = fs.createReadStream(`./input.txt`)
  const rl = readline.createInterface({
    input: filestream,
    crlfDelay: Infinity,
  })

  let values = []
  for await (const line of rl) {
    const bitArray = line.split('').map((val) => parseInt(val))
    values.push(bitArray)
  }

  const bitTracker = calculateMostCommonBits(values)

  const gammaRate = parseInt(
    bitTracker.map((value) => (value > 0 ? 1 : 0)).join(''),
    2
  )
  const epsilonRate = parseInt(
    bitTracker.map((value) => (value > 0 ? 0 : 1)).join(''),
    2
  )
  console.log(
    `Gamma: ${gammaRate}\n` +
      `Episilon: ${epsilonRate}\n` +
      `Result: ${gammaRate * epsilonRate}\n`
  )

  // Filter based on the most common value in each position.
  const oxygenGeneratorRating = filter(values, (value) =>
    // If 0 and 1 are equally common, keep 1s
    value >= 0 ? 1 : 0
  )
  // And least common value in each position.
  const co2ScrubberRating = filter(values, (value) =>
    // If 0 and 1 are equally common, keep 0s
    value >= 0 ? 0 : 1
  )

  console.log(
    `Oxygen generator rating: ${oxygenGeneratorRating}\n` +
      `CO2 Scrubber rating: ${co2ScrubberRating}\n` +
      `Result: ${oxygenGeneratorRating * co2ScrubberRating}\n`
  )
}

function calculateMostCommonBits(values) {
  // Assumption that input vals are 12 bits.
  let bitTracker = Array(12).fill(0)

  values.forEach((bitArray) => {
    bitArray.forEach((bit, i) => {
      const shift = bit === 0 ? -1 : 1
      bitTracker[i] = bitTracker[i] + shift
    })
  })

  return bitTracker
}

/**
 * @param values an array of arrays of binary numbers
 * @param filterFn
 * @returns the filtered value, in decimal
 */
function filter(values, filterFn) {
  let remaining = values
  let bitTracker = calculateMostCommonBits(values)

  // Assumption that the input is 12 bits.
  for (let i = 0; i < 12; i++) {
    const filterValue = filterFn(bitTracker[i])
    remaining = remaining.filter((val) => val[i] === filterValue)

    if (remaining.length === 1) {
      return parseInt(remaining[0].join(''), 2)
    }

    bitTracker = calculateMostCommonBits(remaining)
  }
}

await processLines()
