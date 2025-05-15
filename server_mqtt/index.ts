import mqtt from 'mqtt'

const client = mqtt.connect('mqtt://localhost:1883') // or your broker's IP

client.on('connect', () => {
  console.log('✅ MQTT connected')
  client.subscribe('test/topic', err => {
    if (err) {
      console.error('❌ Subscribe error:', err)
    } else {
      console.log('📡 Subscribed to test/topic')
      client.publish('test/topic', 'Hello from MQTT client!')
    }
  })
})

client.on('message', (topic, message) => {
  console.log(`📨 Message received on ${topic}: ${message.toString()}`)
})