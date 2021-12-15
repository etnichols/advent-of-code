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

const main = async (days) => {
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

await main(256)
