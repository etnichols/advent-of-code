import fs from 'fs'
import readline from 'readline'

async function processLines() {
  const filestream = fs.createReadStream(`./input.txt`)
  const rl = readline.createInterface({
    input: filestream,
    crlfDelay: Infinity,
  })

  let map = []
  for await (const line of rl) {
    const row = line.split('').map((num) => parseInt(num))
    map.push(row)
  }
  return map
}

function calculateLowPoints(map) {
  // Visualize the 2D array as 5 vertical arrays
  // x indexes the x dim, horizontally
  // y indexes the y dim, vertically
  // 0,0 is top left corner.
  const lowPoints = []
  const xMax = map.length
  const yMax = map[0].length
  for (let x = 0; x < xMax; x++) {
    for (let y = 0; y < yMax; y++) {
      const point = map[x][y]

      const up = y === 0 ? Infinity : map[x][y - 1]
      const down = y === yMax - 1 ? Infinity : map[x][y + 1]
      const left = x === 0 ? Infinity : map[x - 1][y]
      const right = x === xMax - 1 ? Infinity : map[x + 1][y]

      // Point is a low point IFF every single point is higher.
      const isLowPoint = [up, down, left, right].every(
        (height) => height > point
      )

      if (isLowPoint) {
        lowPoints.push([x, y])
      }
    }
  }
  return lowPoints
}

function topThreeBasins({ lowPoints, map }) {
  const xMax = map.length
  const yMax = map[0].length

  const basinSizeRecursive = function (point) {
    const [x, y] = point
    if (x < 0 || y < 0 || x >= xMax || y >= yMax) {
      return 0
    }
    if (map[x][y] === 9 || map[x][y] === Infinity) {
      return 0
    }

    // Mark as visited.
    map[x][y] = map[x][y] === 9 ? 9 : Infinity

    return (
      1 +
      /** Top */ basinSizeRecursive([x, y - 1]) +
      /** Bottom */ basinSizeRecursive([x, y + 1]) +
      /** Left */ basinSizeRecursive([x - 1, y]) +
      /** Right */ basinSizeRecursive([x + 1, y])
    )
  }

  let basinSizes = []
  // We know each low point is itself a basin of 1.
  for (const lowPoint of lowPoints) {
    // Return basin size for this point.
    const basinSize = basinSizeRecursive(lowPoint)
    basinSizes.push(basinSize)
  }

  // Top three basin sizes.
  return basinSizes.sort((a, b) => b - a).slice(0, 3)
}

async function main() {
  const map = await processLines()
  const lowPoints = calculateLowPoints(map)

  const lowPointRisk = lowPoints
    .map(([x, y]) => map[x][y] + 1)
    .reduce((prev, cur) => prev + cur)
  console.log('Low point risk sum: ' + lowPointRisk)

  const threeLargestBasinsMult = topThreeBasins({ lowPoints, map }).reduce(
    (prev, cur) => prev * cur
  )
  console.log(`Product of three largest basins: ${threeLargestBasinsMult}`)
}

main()
