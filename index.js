const essentialGoals = [
  'Fletching table use',
  'A Minecraft related song',
  'History lesson (again)',
  'Fake laughing',
  'New new combat update',
  'Cave update',
  'Board game talk',
  'Animated villagers',
  'Someone asks if there are capes',
  'Colab with other brand',
]

const optionalGoals = [
  '"We apologize for the inconvenience this year..."',
  '"We\'re all in this together"',
  '"Stay safe!"',
  '"In these hard / troublesome times..."',
  'NO mention of the word "corona" within 30 minutes',
  'Marketplace victory lap',
  'Non-Mojang creators webcam montage',
  '*awkward silence*',
  'People playing on their phone center-stage',
  'New Dungeons DLC',
  'A joke about masks',
  'Subtle Minecraft merch mention',
  'Dab from staff',
  'Among Us reference',
  'Fake audience',
  'Big Bedrock map',
  'Lights go out, unplanned',
  'Someone on camera not being "supposed to"',
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
  const shuffledGoals = fisherYates(essentialGoals.concat(fisherYates(optionalGoals)).slice(0, 24))

  const grid = document.querySelector('.grid')
  grid.innerHTML = ''
  for (let y = 0; y < 5; y += 1) {
    const row = document.createElement('div')
    grid.appendChild(row)
    row.className = 'row'
    for (let x = 0; x < 5; x += 1) {
      let i = x + 5*y
      const cell = document.createElement('div')
      row.appendChild(cell)
      if (i === 12) {
        cell.className = 'cell free-space'
        cell.innerHTML = 'FREE SPACE<br><BR>Jeb is awkward'
        continue;
      } else if (i > 12) {
        i -= 1;
      }
      cell.className = checked[i] ? 'cell checked' : 'cell'
      cell.textContent = shuffledGoals[i]
      cell.addEventListener('click', () => {
        checked[i] = !checked[i]
        cell.className = checked[i] ? 'cell checked' : 'cell'
        setChecked()
        ga('send', 'event', 'Grid', 'toggle-cell', shuffledGoals[i])
        if (checked[i]) {
          ga('send', 'event', 'Grid', 'check-cell', shuffledGoals[i])
        } else {
          ga('send', 'event', 'Grid', 'uncheck-cell', shuffledGoals[i])
        }
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
  checked = new Array(24).fill(false)
  setChecked()
  ga('send', 'event', 'Grid', 'reset')
  initGrid()
})

Math.seedrandom(localStorage.getItem('minecraftlive.seed') ?? generateSeed())

const checkedString = localStorage.getItem('minecraftlive.checked') ?? '0'.repeat(24)
let checked = checkedString.split('').map(c => c !== '0')

initGrid()
