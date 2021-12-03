import fs from 'fs'
import readline from 'readline'

const processLines = async () => {
  const filestream = fs.createReadStream(`./input.txt`)
  const rl = readline.createInterface({
    input: filestream,
    crlfDelay: Infinity,
  })

  let prevDep = -1
  let increases = 0

  for await (const line of rl) {
    const curDepth = parseInt(line, 10)

    if (prevDep < 0) {
      prevDep = curDepth
      continue
    }

    if (curDepth > prevDep) {
      increases++
    }

    prevDep = curDepth
  }

  console.log('Increases: ' + increases)
}

const processLinesWindow = async () => {
  const filestream = fs.createReadStream(`./input.txt`)
  const rl = readline.createInterface({
    input: filestream,
    crlfDelay: Infinity,
  })

  const summer = (prev, cur) => prev + cur

  let increases = 0
  let prevWindow = []

  for await (const line of rl) {
    const curDepth = parseInt(line, 10)

    if (prevWindow.length < 3) {
      prevWindow.push(curDepth)
      continue
    }

    // Else, window compare.
    const previousWindowTotal = prevWindow.reduce(summer)

    let currentWindow = prevWindow.slice(1).concat(curDepth)
    const currentWindowTotal = currentWindow.reduce(summer)

    if (currentWindowTotal > previousWindowTotal) {
      increases++
    }

    prevWindow = currentWindow
  }

  console.log('Increases (window): ' + increases)
}

await processLines()
await processLinesWindow()
