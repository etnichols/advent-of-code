// However, this process isn't necessarily synchronized between every lanternfish - one lanternfish might have 2 days left until it creates another lanternfish, while another might have 4. So, you can model each fish as a single number that represents the number of days until it creates a new lanternfish.
// import fs from 'fs'

import fs from 'fs/promises'
import path from 'path'

class Laternfish {
  constructor(days) {
    this.days_ = days
  }

  // do day
  runDay() {
    this.days_--

    if (this.days_ === -1) {
      // produce new fish
      this.days_ = 6
      return new Laternfish(8)
    }
    // no new fish.
    return null
  }
}

const mainSlow = async (days) => {
  const filePath = path.join(path.resolve(), 'input.txt')
  const input = await fs
    .readFile(filePath, { encoding: 'utf-8' })
    .catch((e) => console.log('Error reading file: ' + e))

  const initFishes = input
    .split(',')
    .map((age) => new Laternfish(parseInt(age)))

  let school = initFishes.slice()

  // TODO(naive slow solution. Need to bucket. Lots of duplicated work).
  for (let i = 0; i < days; i++) {
    let newFish = []
    school.forEach((fish) => {
      let maybeFish = fish.runDay()
      if (maybeFish) {
        newFish.push(maybeFish)
      }
    })
    school = school.concat(newFish)
    console.log(`school size (${i}): ${school.length}`)
  }
}

const mainFast = async (days) => {
  const filePath = path.join(path.resolve(), 'input.txt')
  const input = await fs
    .readFile(filePath, { encoding: 'utf-8' })
    .catch((e) => console.log('Error reading file: ' + e))

  // An array where index is the internal timer value of the
  // Laternfish, and the value is the number of fish at that day.
  const fish = new Array(9).fill(0)
  const initFishes = input.split(',').forEach((days) => fish[days]++)

  for (let i = 0; i < days; i++) {
    // Fish with internal timer 0 on the new day produce new fish.
    const newFish = fish.shift()
    // They get reset.
    fish[6] += newFish
    // New fish on the back of the array (internal timer 8).
    fish.push(newFish)
  }

  console.log('Total fish: ' + fish.reduce((prev, cur) => prev + cur))
}

await mainFast(256)
