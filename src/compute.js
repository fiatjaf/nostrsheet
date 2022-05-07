export function computeCell(value, grid) {
  if (!value.startsWith('=')) {
    return {value}
  }

  return new Promise(resolve =>
    setTimeout(() => resolve({value, computed: value + 'c'}), 5000)
  )
}
