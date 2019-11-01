const { exec } = require('child_process')

let extension = ''

if (process.env.NODE_ENV === 'production') {
  extension = '_prod'
}

const tasks = [
  `npm run reset_script_states${extension}`,
  `npm run fetch_games${extension}`,
  `npm run fetch_boxscores${extension}`,
  `npm run fetch_goals${extension}`,
  `npm run fetch_team_stats${extension}`,
]

const loadProcess = process => {
  return new Promise((resolve, reject) => {
    console.log(`Running "${process.substring(8)}"`)
    const cp = exec(process)
    cp.stdout.on('data', data => {
      console.log(data)
    })
    cp.stderr.on('data', data => {
      console.log('stderr:\n', data)
    })
    cp.on('close', code => {
      console.log(`Process "${process.substring(8)}" exited with code ${code}`)
      resolve()
    })
  })
}

const runProcesses = async () => {
  for (const task of tasks) {
    await loadProcess(task)
  }
}

runProcesses(() => console.log('All tasks completed.'))
