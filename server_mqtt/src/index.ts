import mqtt from 'mqtt';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.MQTT_URL) {
  console.error('❌ MQTT_URL is not defined in .env file');
  process.exit(1);
}

const client = mqtt.connect(process.env.MQTT_URL);

const earthquakeOnlyDistricts = ['5e', '9e'];
const bothEventsDistricts = ['1er', '2e', '4e'];
const floodOnlyDistricts = ['3e', '6e', '7e', '8e'];

const districts = [
  ...earthquakeOnlyDistricts,
  ...bothEventsDistricts,
  ...floodOnlyDistricts,
];

// Helper to pick random element from array
function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate payload based on event type
function generateEventPayload(eventType: string) {
  const timestamp = new Date().toISOString();

  if (eventType === 'earthquake') {
    return {
      magnitude: +(Math.random() * 5 + 1).toFixed(1), // 1.0 - 6.0
      depth: Math.floor(Math.random() * 30) + 1,      // 1 - 30 km
      timestamp,
    };
  } else if (eventType === 'flood') {
    return {
      waterLevel: +(Math.random() * 3 + 0.5).toFixed(2), // 0.5 - 3.5 meters
      duration: Math.floor(Math.random() * 8) + 1,       // 1 - 8 hours
      timestamp,
    };
  } else {
    // For 'none' event type — no disaster info, just a fixed message
    return {
    };
  }
}

// Decide event type for a district including a chance for no event
function getEventTypeForDistrict(district: string): string {
  const random = Math.random();

  if (random < 0.2) return 'none'; // 20% chance for no event

  if (earthquakeOnlyDistricts.includes(district)) {
    return 'earthquake';
  } else if (floodOnlyDistricts.includes(district)) {
    return 'flood';
  } else {
    // For districts that can have both, randomly choose flood or earthquake
    return Math.random() > 0.5 ? 'earthquake' : 'flood';
  }
}

function publishRandomEvent() {
  const arrondissement = getRandomElement(districts);
  const event = getEventTypeForDistrict(arrondissement);

  const topic = `lyon/${arrondissement}/${event}`;
  const payload = generateEventPayload(event);

  client.publish(topic, JSON.stringify(payload));
  console.log(`📤 Published to ${topic}:`, payload);
}

client.on('connect', () => {
  console.log('✅ Connected to MQTT broker');
  publishRandomEvent();
  setInterval(publishRandomEvent, 1000 * 1); // every 30 seconds
});