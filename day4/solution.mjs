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
  for (let i = 0; i < callOrder.length; i++) {
    const numCalled = callOrder[i]

    for (let ii = 0; i < boards.length; ii++) {
      const board = boards[ii]
      for (let x = 0; x < board.length; x++) {
        for (let xx = 0; xx < board.length; xx++) {
          if (board[x][xx] == numCalled) {
            board[x][xx] = board[x][xx] * -1
            if (isWinner(board)) {
              console.log('winner!')
              return board
            }
          }
        }
      }
    }
  }
}

async function main() {
  const { callOrder, boards } = await processLines()

  const winningBoard = runGames({ callOrder, boards })

  // Play the games.
  return 0
}

/** Given 2D-array of bingo squares marked with -1 as "got it" */
function isWinner(board) {
  const hasHorizontalWinner = board.some((array) =>
    array.every((val) => val < 0)
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

  const hasVerticalWinner = verts.some((array) => array.every((val) => val < 0))

  return hasVerticalWinner
}

await main()
