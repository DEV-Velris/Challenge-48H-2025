import mqtt from 'mqtt'

const client = mqtt.connect('mqtt://localhost:1883') // or your broker's IP

const latestEvents: Record<string, any> = {}

client.on('connect', () => {
  console.log('✅ MQTT connected')
  client.subscribe('test/topic', err => {
    if (err) {
      console.error('❌ Subscribe error:', err)
    } else {
      console.log('📡 Subscribed to test/topic')
      client.publish('test/topic', JSON.stringify({ msg: 'Hello from MQTT client!' }))
    }
  })
})

client.on('message', (topic, message) => {
  const messageStr = message.toString()
  console.log(`📨 Message received on ${topic}: ${messageStr}`)

  try {
    const payload = JSON.parse(messageStr)
    latestEvents[topic] = payload
  } catch (err) {
    console.warn('⚠️ Received non-JSON message:', messageStr)
  }
})

export { latestEvents }