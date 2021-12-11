import fs from 'fs'
import readline from 'readline'

const processLines = async () => {
  const filestream = fs.createReadStream(`./input.txt`)
  const rl = readline.createInterface({
    input: filestream,
    crlfDelay: Infinity,
  })

  let map = new Array(1000)
  for (let k = 0; k < 1000; k++) {
    map[k] = new Array(1000).fill(0)
  }

  for await (const line of rl) {
    let [start, end] = line
      .split(' -> ')
      .map((piece) => piece.split(',').map((int) => parseInt(int)))

    let [x1, y1] = start
    let [x2, y2] = end

    const isVertical = x1 === x2
    const isHorizontal = y1 === y2

    if (isVertical) {
      const [start, end] = [y1, y2].slice().sort((a, b) => a - b)
      for (let y = start; y <= end; y++) {
        map[x1][y]++
      }
    }

    if (isHorizontal) {
      const [start, end] = [x1, x2].slice().sort((a, b) => a - b)
      for (let x = start; x <= end; x++) {
        map[x][y1]++
      }
    }

    if (!isHorizontal && !isVertical) {
      // Determine which way the line is going.
      let xOp = x1 > x2 ? 'sub' : 'add'
      let yOp = y1 > y2 ? 'sub' : 'add'

      let curX = x1
      let curY = y1
      let toMark = []
      toMark.push([curX, curY])

      // traverse diagonally.
      while (curX !== x2 && curY !== y2) {
        curX += xOp === 'add' ? 1 : -1
        curY += yOp === 'add' ? y : -1
        toMark.push([curX, curY])
      }

      // Mark the diagonal.
      toMark.forEach(([x, y]) => {
        map[x][y]++
      })
    }
  }

  const numSpotsWithThreshold = map
    .map((line) => line.filter((num) => num >= 2).length)
    .reduce((prev, cur) => prev + cur)
  console.log(`Num spots with at least two overlap: ${numSpotsWithThreshold}`)
}

await processLines()
