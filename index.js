const goals = [
  '"We apologize for the inconvenience this year..."',
  '"We\'re all in this together"',
  '"In these hard / troublesome times..."',
  '"Stay safe!"',
  'NO mention of the word "corona" within 30 minutes',
  'Fletching table use',
  'Marketplace victory lap',
  'Non-Mojang creators webcam montage',
  'A Minecraft related song',
  'History lesson (again)',
  'Lights go out, unplanned',
  '*awkward silence*',
  'People playing on their phone center-stage',
  'Fake laughing',
  'Someone on camera not being "supposed to"',
  'New Dungeons DLC',
  'New new combat update',
  'Someone calles the iceologer, chillager',
  'A joke about masks',
  'Cave update',
  'Board game talk',
  'Animated villagers',
  'Live game with guests',
  'Subtle Minecraft merch mention',
  'Someone asks if there are capes',
  'Dab from staff',
  'Among Us reference',
  'Colab with other brand',
  'Fake audience',
  'Big Bedrock map',
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
        ga('send', 'event', 'Grid', 'toggle-cell')
      })
    }
  }
}

function setChecked() {
  localStorage.setItem('minecraftlive.checked', checked.map(e => e ? '1' : '0').join(''))
  ga('set', 'metric1', checked.filter(e => e).length)
}

document.querySelector('.new-seed').addEventListener('click', () => {
  Math.seedrandom(generateSeed())
  checked = new Array(25).fill(false)
  setChecked()
  ga('send', 'event', 'Grid', 'reset')
  initGrid()
})

Math.seedrandom(localStorage.getItem('minecraftlive.seed') ?? generateSeed())

const checkedString = localStorage.getItem('minecraftlive.checked') ?? '0'.repeat(25)
let checked = checkedString.split('').map(c => c !== '0')

initGrid()
