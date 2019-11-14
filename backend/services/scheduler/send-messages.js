const sendMessages = async (channel, queue, messages) => {
  if (!Array.isArray(messages)) {
    messages = [messages]
  }
  try {
    for (const message of messages) {
      await channel.sendToQueue(queue, message, {
        contentType: 'application/json',
        persistent: true,
      })
      console.log(`[AMQP] - Message sent to queue => ${queue}`)
    }
  } catch (err) {
    console.error(
      `[AMQP] - Message to queue => ${queue} <= was rejected! `,
      err.stack
    )
  }
}

module.exports = { sendMessages }
