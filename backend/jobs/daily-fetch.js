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

let envExt = ''
let dateExt = ''

if (process.argv.length > 2) {
  dateExt = ` ${process.argv[2]}`
}

if (process.env.NODE_ENV === 'production') {
  envExt = '_prod'
}

const tasks = [
  `npm run reset_script_states${envExt}`,
  `npm run fetch_games${envExt}${dateExt}`,
  `npm run fetch_boxscores${envExt}${dateExt}`,
  `npm run fetch_goals${envExt}${dateExt}`,
  `npm run fetch_linescores${envExt}${dateExt}`,
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
