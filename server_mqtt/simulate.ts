import mqtt from 'mqtt'

const client = mqtt.connect('mqtt://localhost:1883')

const arrondissements = ['1er', '2e', '3e', '4e', '5e', '6e', '7e', '8e', '9e']
const events = ['earthquake', 'flood']

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateEventPayload(eventType: string) {
  const timestamp = new Date().toISOString()

  if (eventType === 'earthquake') {
    return {
      magnitude: +(Math.random() * 5 + 1).toFixed(1), // 1.0 - 6.0
      depth: Math.floor(Math.random() * 30) + 1, // 1 - 30 km
      timestamp
    }
  } else {
    return {
      waterLevel: +(Math.random() * 3 + 0.5).toFixed(2), // 0.5 - 3.5 meters
      duration: Math.floor(Math.random() * 8) + 1, // 1 - 8 hours
      timestamp
    }
  }
}

function publishRandomEvent() {
  const arrondissement = getRandomElement(arrondissements)
  const event = getRandomElement(events)
  const topic = `lyon/${arrondissement}/${event}`
  const payload = generateEventPayload(event)

  client.publish(topic, JSON.stringify(payload), () => {
    console.log(`📤 Sent to ${topic}: ${JSON.stringify(payload)}`)
  })
}

client.on('connect', () => {
  console.log('✅ Connected to MQTT broker')
  // Publish a random event every 2 seconds
  setInterval(publishRandomEvent, 2000)
})