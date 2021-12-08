import fs from 'fs'
import readline from 'readline'

const processLines = async () => {
  const filestream = fs.createReadStream(`./input.txt`)
  const rl = readline.createInterface({
    input: filestream,
    crlfDelay: Infinity,
  })

  let callOrder
  let currentBoard = []
  let boards = []

  let ind = 0
  let boardInd = 0
  for await (const line of rl) {
    if (ind === 0) {
      callOrder = line.split(',').map((val) => parseInt(val))
      ind++
      continue
    }

    if (ind === 1) {
      ind++
      continue
    }

    if (boardInd <= 4) {
      // Process board line.
      const spots = line
        .trim()
        .split(' ')
        .filter((val) => !!val.trim().length)
        .map((val) => parseInt(val.trim()))
      currentBoard.push(spots)
      boardInd++
    } else {
      if (currentBoard.length !== 5) {
        throw new Exception(
          'Expected board to be length 5, but actually is: ',
          currentBoard.length
        )
      }
      if (line.trim().length) {
        throw new Exception('Expected line to be empty but got: ', line)
      }

      // Reset board.
      boards.push(currentBoard.slice())
      currentBoard = []
      boardInd = 0
    }
  }

  return {
    callOrder,
    boards,
  }
}

function runGames({ callOrder, boards }) {
  let remaining = boards
  for (let i = 0; i < callOrder.length; i++) {
    const numCalled = callOrder[i]

    for (let ii = 0; ii < boards.length; ii++) {
      const board = boards[ii]

      for (let x = 0; x < board.length; x++) {
        for (let xx = 0; xx < board.length; xx++) {
          if (board[x][xx] === numCalled) {
            board[x][xx] = board[x][xx] * -1
            remaining = remaining.filter(
              (filteredBoard) => !isWinner(filteredBoard)
            )
            if (remaining.length === 0) {
              console.log('last winner')
              return {
                winningBoard: board,
                winningNumber: numCalled,
              }
            }
          }
        }
      }
    }
  }
}

async function main() {
  const { callOrder, boards } = await processLines()

  const { winningBoard, winningNumber } = runGames({ callOrder, boards })

  // Sum all unmarked numbers
  const sumOfUnmarked = winningBoard
    .map((arr) => arr.filter((val) => val > 0))
    .map((filteredArr) =>
      filteredArr.length ? filteredArr.reduce((prev, curr) => prev + curr) : 0
    )
    .reduce((prevSum, currSum) => prevSum + currSum)

  console.log(
    `Sum of unmarked: ${sumOfUnmarked}, winning: ${winningNumber}, Result: ${
      sumOfUnmarked * winningNumber
    }`
  )

  // Play the games.
  return 0
}

/** Given 2D-array of bingo squares marked with -1 as "got it" */
function isWinner(board) {
  const hasHorizontalWinner = board.some((array) =>
    array.every((val) => {
      const sign = Math.sign(val)
      return sign === -1 || sign === -0
    })
  )

  if (hasHorizontalWinner) {
    return true
  }

  // construct vert arrays
  let verts = [[], [], [], [], []]
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      verts[j][i] = board[i][j]
    }
  }

  const hasVerticalWinner = verts.some((array) =>
    array.every((val) => {
      const sign = Math.sign(val)
      return sign === -1 || sign === -0
    })
  )

  return hasVerticalWinner
}

await main()
