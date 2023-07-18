import { Context } from '@/contexts/application'
import { GameState } from '@/lib/enums'
import { Cell } from '@/lib/types'
import { FC, useContext, MouseEvent } from 'react'
import { Bomb, Flag } from 'lucide-react'

const Tile: FC<{ cell: Cell }> = ({ cell }) => {
  const { setGameState, grid, setGrid, flagsNumber, setFlagsNumber } =
    useContext(Context)

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!grid) {
      return
    }

    if (e.ctrlKey) {
      if (!cell.revealed && !cell.flagged) {
        grid.forEach((l) => {
          l.forEach((c) => {
            if (c === cell) {
              c.flagged = true
            }
          })
        })
        setGrid(structuredClone(grid))
        setFlagsNumber(flagsNumber + 1)
      } else if (!cell.revealed && cell.flagged) {
        grid.forEach((l) => {
          l.forEach((c) => {
            if (c === cell) {
              c.flagged = false
            }
          })
        })
        setGrid(structuredClone(grid))
        setFlagsNumber(flagsNumber - 1)
      }
    } else {
      if (cell.haveBomb) {
        grid.forEach((ll) => {
          ll.forEach((cc) => {
            cc.revealed = true
          })
        })
        setGrid(structuredClone(grid))
        setGameState(GameState.LOST)
      } else {
        grid.forEach((ll) => {
          ll.forEach((cc) => {
            if (cc === cell) {
              cc.revealed = true
            }
          })
        })
        setGrid(structuredClone(grid))
      }
    }
  }

  if (cell.revealed && cell.haveBomb) {
    return (
      <div
        onClick={handleClick}
        className="col-span-1 flex grow-0 items-center justify-center bg-red-400"
      >
        <Bomb />
      </div>
    )
  }

  if (cell.revealed) {
    return (
      <div
        onClick={handleClick}
        className="col-span-1 flex grow-0 items-center justify-center bg-gray-400"
      >
        {cell.bombsAround === 0 ? <p>&nbsp;</p> : cell.bombsAround}
      </div>
    )
  }

  if (!cell.flagged) {
    return (
      <div
        onClick={handleClick}
        className="col-span-1 flex grow-0 items-center justify-center bg-gray-400"
      >
        <p>&nbsp;</p>
      </div>
    )
  }

  if (cell.flagged) {
    return (
      <div
        onClick={handleClick}
        className="col-span-1 flex grow-0 items-center justify-center bg-emerald-400"
      >
        <Flag />
      </div>
    )
  }
}

export default Tile
