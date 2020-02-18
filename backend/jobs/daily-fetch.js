/*
This is the core script of the application. Does all major data fetching.

If this fails due to inconsistent data in the API, the fetch scripts can
be run separately with date argument (YYYY-MM-DD).

It is important to delete any partially fetched data using a utility script
in mongo-scripts.js.

When running scripts manually, make sure that you are using the correct DB
in the env file. You probably want to use -prod db if daily_fetch on the
server has failed.
*/

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
  `npm run fetch_linescores${extension}`,
]

const loadProcess = process => {
  return new Promise((resolve, reject) => {
    console.log(`Running "${process.substring(8)}"`)
    const cp = exec(process)
    cp.stdout.on('data', data => {
      console.log(data)
    })
    cp.stderr.on('data', data => {
      console.error('stderr:\n', data)
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

runProcesses()
  .then(() => {
    console.log('All tasks completed.')
    process.exit(0)
  })
  .catch(err => {
    console.error('daily-fetch.runProcesses', err.stack)
    process.exit(1)
  })
