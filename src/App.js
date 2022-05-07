import React, {useState, useEffect} from 'react'
import DataSheet from 'react-datasheet'
import styled from 'styled-components'
import {relayPool} from 'nostr-tools'

import {computeCell} from './compute'

const pool = relayPool()

const Wrapper = styled.div`
  margin: 12px;
`

const defaultGrid = [
  [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}],
  [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}],
  [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}],
  [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}]
]

function App() {
  const [nip7, setNIP7] = useState(false)
  const [grid, setGrid] = useState(defaultGrid)

  useEffect(() => {
    setTimeout(() => {
      setNIP7(!!window.nostr)
    }, 500)
  }, [])

  useEffect(() => {
    if (grid === defaultGrid) return
    localStorage.setItem('data', JSON.stringify(grid))
  }, [grid])

  useEffect(() => {
    setTimeout(async () => {
      const loadedGrid = JSON.parse(localStorage.getItem('data') || 'null')
      if (loadedGrid) {
        setGrid(
          await Promise.all(
            loadedGrid.map(row =>
              Promise.all(row.map(cell => computeCell(cell.value, grid)))
            )
          )
        )
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
          valueRenderer={cell => cell.computed || cell.value}
          onCellsChanged={handleCellsChanged}
        />
      </div>
    </Wrapper>
  )

  function handleCellsChanged(changes) {
    changes.forEach(async ({cell, row: rowN, col: colN, value}) => {
      let computed = computeCell(value, grid)
      if (computed.then) {
        // is a promise
        grid[rowN][colN].value = value
        grid[rowN][colN].computed = '...' // we set stuff as loading and then wait for the promise to resolve
        ;((row, colN) => {
          computed.then(awaitedComputed => {
            row[colN] = awaitedComputed
            setGrid(grid)
          })
        })(grid[rowN], colN)
      } else {
        // it's a direct value
        grid[rowN][colN] = computed
      }
    })
    setGrid([...grid])
  }
}

export default App
