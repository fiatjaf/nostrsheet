import React, {useState, useEffect} from 'react'
import DataSheet from 'react-datasheet'
import styled from 'styled-components'

import {grid, computeCell} from './compute'

const Wrapper = styled.div`
  margin: 12px;
`

function App() {
  const [nip7, setNIP7] = useState(false)
  const [updateCount, setUpdateCount] = useState(0)
  const bumpGrid = () => setUpdateCount(i => i + 1)

  useEffect(() => {
    setTimeout(() => {
      setNIP7(!!window.nostr)
    }, 500)
  }, [])

  useEffect(() => {
    if (updateCount === 0) return
    localStorage.setItem('data', JSON.stringify(grid))
  }, [updateCount])

  useEffect(() => {
    setTimeout(async () => {
      const loadedGrid = JSON.parse(localStorage.getItem('data') || 'null')
      if (loadedGrid) {
        // replace grid
        for (let i = 0; i < loadedGrid.length; i++) {
          grid[i] = loadedGrid[i]
        }

        // calculate formulas
        for (let i = 0; i < grid.length; i++) {
          for (let j = 0; j < grid[i].length; j++) {
            runComputeCell(grid[i][j].value, i, j)
          }
        }
      }
    }, 1)
  }, [])

  if (!nip7) {
    return (
      <div>
        please install{' '}
        <a href="https://chrome.google.com/webstore/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjjp">
          nos2x
        </a>{' '}
        or another{' '}
        <a href="https://github.com/nostr-protocol/nips/blob/master/07.md">
          NIP-07
        </a>{' '}
        compatible extension.
      </div>
    )
  }

  return (
    <Wrapper>
      <div>
        <DataSheet
          data={grid}
          dataRenderer={cell => cell.value || ''}
          valueRenderer={cell => cell.computed || cell.value || ''}
          onCellsChanged={handleCellsChanged}
        />
      </div>
    </Wrapper>
  )

  function runComputeCell(value, rowN, colN) {
    let computed = computeCell(value || '', {row: rowN + 1, col: colN + 1})
    if (computed.then) {
      // is a promise
      grid[rowN][colN].value = value
      grid[rowN][colN].computed = '...' // we set stuff as loading and then wait for the promise to resolve
      ;((row, colN) => {
        computed
          .then(awaitedComputed => {
            row[colN] = awaitedComputed
            bumpGrid()
          })
          .catch(err => {
            row[colN] = `${err}`
            bumpGrid()
          })
      })(grid[rowN], colN)
    } else {
      // it's a direct value
      grid[rowN][colN] = computed
    }
  }

  function handleCellsChanged(changes) {
    changes.forEach(({row: rowN, col: colN, value}) => {
      runComputeCell(value, rowN, colN)
    })
  }
}

export default App
