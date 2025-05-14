import { spawn } from 'child_process'

const pythonBackend = spawn('python3', ['../backend/enhanced_backend.py'])

pythonBackend.stdout.on('data', (data) => {
  console.log(`Backend: ${data}`)
})

pythonBackend.stderr.on('data', (data) => {
  console.error(`Backend Error: ${data}`)
})
