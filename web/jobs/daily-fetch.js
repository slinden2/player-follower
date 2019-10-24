const { fork } = require('child_process')

const script1 = fork('test-script1.js', { cwd: './jobs/' })
const script2 = fork('test-script2.js', { cwd: './jobs/' })

const processes = [script1, script2]

for (const process of processes) {
  process.on('message', msg => {
    console.log(`message from child: ${msg}`)
  })

  process.on('error', error => console.log(error))

  process.on('exit', (code, signal) =>
    console.log('process ended ' + code + ' ' + signal)
  )
}

// script1.on('message', msg => {
//   console.log(`message from child:\n${msg.counter}`)
// })

// script1.send({ hello: 'world' })
