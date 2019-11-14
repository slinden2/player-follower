const Job = require('../../models/job')

const getJobs = async () => {
  // Find jobs that execTime has passed or is within 5 minutes
  const jobs = await Job.find({
    isDone: false,
    $expr: {
      $and: [
        { $gte: [300000, { $subtract: ['$execTime', new Date()] }] },
        { $lte: ['$attempts', 3] },
      ],
    },
  })
  return jobs.map(job => job.toJSON())
}

module.exports = getJobs
