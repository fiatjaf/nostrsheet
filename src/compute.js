import FormulaParser from 'fast-formula-parser'

import {pool} from './nostr'

const defaultGrid = () => [
  [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}],
  [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}],
  [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}],
  [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}]
]

export const grid = defaultGrid()

const parser = new FormulaParser({
  onCell({row, col}) {
    // using 1-based index
    return grid[row - 1][col - 1]
  },
  functions: {
    async NOSTREVENT({value: eventId}) {
      return await pool.getEvent(eventId)
    }
  }
})

export function computeCell(value, position) {
  if (!value.startsWith('=') || value.length === 1) {
    return {value}
  }

  return parser
    .parseAsync(value.slice(1), position)
    .then(res => ({value, computed: res.value || res}))
}
