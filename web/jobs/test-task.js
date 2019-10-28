console.log('Hello from the test task!')
console.log('Starting to work...')
setTimeout(() => {
  console.log('Task 1 done.')
  setTimeout(() => {
    console.log('Task 2 done.')
    console.log('testTask completed.')
  }, 10000)
}, 5000)
