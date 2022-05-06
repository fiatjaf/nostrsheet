import React, {useState} from 'react'
import ReactDataSheet from 'react-datasheet'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin: 12px;
`

function App() {
  const [grid, setGrid] = useState([
    [{value: ''}, {value: 0}],
    [{value: '0'}, {value: ''}]
  ])

  return (
    <Wrapper>
      <div>Hello</div>
      <div>
        <ReactDataSheet
          data={grid}
          valueRenderer={cell => cell.value}
          onCellsChanged={changes => {
            changes.forEach(({cell, row, col, value}) => {
              grid[row][col] = {...grid[row][col], value}
            })
            setGrid(grid)
          }}
        />
      </div>
    </Wrapper>
  )
}

export default App
