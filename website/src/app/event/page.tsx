'use client'

import { useEffect, useState } from 'react'
import mqtt from 'mqtt'

export default function InfoPage() {
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    const client = mqtt.connect('ws://localhost:9001')

    client.on('connect', () => {
      console.log('✅ Connecté au broker MQTT via WebSocket')
      client.subscribe('lyon/#', (err) => {
        if (err) console.error('❌ Erreur subscription', err)
        else console.log('📡 Abonné au topic lyon/#')
      })
    })

    client.on('message', (topic, message) => {
      const msg = message.toString()
      console.log(`📨 Message reçu sur ${topic}: ${msg}`)
      setMessages((prev) => [...prev, `[${topic}] ${msg}`])
    })

    client.on('error', (error) => {
      console.error('❌ MQTT error:', error)
    })

    return () => {
      client.end()
    }
  }, [])

  return (
    <div>
      <h1>Messages MQTT reçus :</h1>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  )
}