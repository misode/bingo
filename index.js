const goals = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
]

function generateSeed(length = 12) {
  var arr = new Uint8Array(length / 2)
  window.crypto.getRandomValues(arr)
  const seed = Array.from(arr, d => ('0' + d.toString(16)).substr(-2)).join('')
  localStorage.setItem('minecraftlive.seed', seed)
  return seed
}

function fisherYates(originalArray) {
  const array = originalArray.slice(0);
  for (let i = (array.length - 1); i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}

function initGrid() {
  const shuffledGoals = fisherYates(goals).slice(0, 25)

  const grid = document.querySelector('.grid')
  grid.innerHTML = ''
  for (let y = 0; y < 5; y += 1) {
    const row = document.createElement('div')
    grid.appendChild(row)
    row.className = 'row'
    for (let x = 0; x < 5; x += 1) {
      const i = x + 5*y
      const cell = document.createElement('div')
      row.appendChild(cell)
      cell.className = checked[i] ? 'cell checked' : 'cell'
      cell.textContent = shuffledGoals[i]
      cell.addEventListener('click', () => {
        checked[i] = !checked[i]
        cell.className = checked[i] ? 'cell checked' : 'cell'
        setChecked()
      })
    }
  }
}

function setChecked() {
  localStorage.setItem('minecraftlive.checked', checked.map(e => e ? '1' : '0').join(''))
}

document.querySelector('.new-seed').addEventListener('click', () => {
  Math.seedrandom(generateSeed())
  checked = new Array(25).fill(false)
  setChecked()
  initGrid()
})

Math.seedrandom(localStorage.getItem('minecraftlive.seed') ?? generateSeed())

const checkedString = localStorage.getItem('minecraftlive.checked') ?? '0'.repeat(25)
let checked = checkedString.split('').map(c => c !== '0')

initGrid()
