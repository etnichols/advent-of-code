import fs from 'fs'
import readline from 'readline'

const processLines = async () => {
  const filestream = fs.createReadStream(`./input.txt`)
  const rl = readline.createInterface({
    input: filestream,
    crlfDelay: Infinity,
  })

  let depth = 0
  let horizontal = 0
  let aim = 0

  for await (const line of rl) {
    const [command, rawNum] = line.split(' ')
    const parsedNum = parseInt(rawNum)
    switch (command) {
      case 'forward':
        horizontal += parsedNum
        depth += aim * parsedNum
        break
      case 'down':
        aim += parsedNum
        break
      case 'up':
        aim -= parsedNum
        break
    }
  }

  console.log(
    `Depth: ${depth}, horizontal: ${horizontal}, mult: ${depth * horizontal}`
  )
}

await processLines()
