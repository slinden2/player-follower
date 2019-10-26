const { convertMMSStoSec } = require('../fetch-helpers')

const getPlaybacks = data => {
  return data.map(playback => {
    playback.width =
      playback.width && playback.width !== 'null'
        ? parseInt(playback.width)
        : null
    playback.height =
      playback.height && playback.height !== 'null'
        ? parseInt(playback.height)
        : null
    return playback
  })
}

const createVideoData = data => {
  return {
    videoId: parseInt(data.id),
    title: data.title.trim(),
    blurb: data.blurb.trim(),
    description: data.description.trim(),
    duration: convertMMSStoSec(data.duration),
    mediaPlaybackId: parseInt(data.mediaPlaybackId),
    playbacks: getPlaybacks(data.playbacks),
  }
}

module.exports = createVideoData
