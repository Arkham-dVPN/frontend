
import { NextResponse } from 'next/server'

// Mock data for the two states
const securedData = {
  status: 'Secured',
  ip: '98.176.21.114', // A fake "secured" IP
  dataTransferred: '2.1 GB',
  activeNodes: 1247,
}

const exposedData = {
  status: 'Not Connected',
  ip: '192.168.1.1', // A typical local IP
  dataTransferred: '0 GB',
  activeNodes: 1247,
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const veilActive = searchParams.get('veilActive') === 'true'

  // Return secured data if the veil is active, otherwise return exposed data
  const data = veilActive ? securedData : exposedData

  // Add a small delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500))

  return NextResponse.json(data)
}
