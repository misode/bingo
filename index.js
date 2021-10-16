const essentialGoals = [
  'Fletching table use',
  'The Glare is eliminated round one',
  'Board game talk',
  'Epic Minecraft musical animation',
  'Dream rigging the vote',
  'New Dungeons DLC',
  'The update will be split again',
  'Someone saying they want all the mobs to win',
  'New boss is introduced',
  'Quadromorphic Endervision',
]

const optionalGoals = [
  'Someone asks if there are capes',
  'Marketplace victory lap',
  'Content creators webcam montage',
  'People playing on consoles center-stage',
  'Subtle Minecraft merch mention',
  'Fake audience',
  'Big Bedrock map',
  'A cat steals the show',
  'RTX advertisement',
  'Minecraft Tiktoks',
  'Fireworks in Minecraft',
  'Accessibility in Minecraft',
  'Concept art for the new update',
  'Live reactions from Twitter',
  'Someone advocates for the Glare',
  'Looking back on Minecraft Earth',
  'Minecraft being used by students',
  '"That\'s an excellent question"',
  'Creator tools are showcased',
  'Transportation update',
  'End update',
  'More info about archeology',
  'Jeb screams "nooooooo"',
]

const freeSpaces = [
  'Jeb is awkward',
  'Agnes is smiling non-stop',
  'Lydia is overly excited',
  'Devs are wholesome',
]

function generateSeed(length = 12) {
  var arr = new Uint8Array(length / 2)
  window.crypto.getRandomValues(arr)
  const seed = Array.from(arr, d => ('0' + d.toString(16)).substr(-2)).join('')
  localStorage.setItem('minecraftlive.seed', seed)
  return seed
}

function fisherYates(originalArray) {
  const array = originalArray.slice(0)
  for (let i = (array.length - 1); i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]]
  }
  return array
}

function initGrid() {
  const shuffledGoals = fisherYates(essentialGoals.concat(fisherYates(optionalGoals)).slice(0, 24))
  const feeSpace = freeSpaces[Math.floor(Math.random() * freeSpaces.length)]

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
        cell.innerHTML = feeSpace
        continue
      } else if (i > 12) {
        i -= 1
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
