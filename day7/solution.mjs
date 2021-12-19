import fs from 'fs/promises'
import path from 'path'

const main = async () => {
  const filePath = path.join(path.resolve(), 'input.txt')
  const input = await fs
    .readFile(filePath, { encoding: 'utf-8' })
    .catch((e) => console.log('Error reading file: ' + e))

  const positions = input.split(',').map((age) => parseInt(age))
  const numCrabs = positions.length

  let leastFuel = Number.MAX_SAFE_INTEGER
  let largest = Math.max(...positions)

  for (let i = 0; i < largest; i++) {
    let currentFuel = 0
    positions.forEach((position) => {
      // Part 2: cost scales with distance.
      // First step cost 1, second costs 2...
      // Thus to move from 1 to 5 (4 positions) = 1 + 2 + 3 + 4 = 10.
      // Summation of infinite series 1 + 2 + 3 + 4 = n(n+1)/2
      const distance = Math.abs(position - i)
      const cost = (distance * (distance + 1)) / 2
      currentFuel += cost
    })

    leastFuel = Math.min(leastFuel, currentFuel)
  }

  console.log('Least fuel: ', leastFuel)
}

main()
