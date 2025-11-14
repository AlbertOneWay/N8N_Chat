import { useState } from 'react'
import ChatContainer from './components/ChatContainer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
            Chat con Asistente IA de la Universidad de Caldas
          </h1>
          <p className="text-blue-600 text-lg opacity-80">
            Tu asistente inteligente
          </p>
        </div>
        <ChatContainer />
      </div>
    </div>
  )
}

export default App
