import { useState, useRef, useEffect } from 'react'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { n8nService } from '../services/n8nService'

const ChatContainer = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '¡Hola!',
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [userStatus, setUserStatus] = useState('need_opt_in') // need_opt_in | accepted | opt_out | normal
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (message) => {
    if (!message.trim()) return

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      text: message,
      isBot: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Verificar comandos especiales
      const upperMessage = message.toUpperCase().trim()
      
      if (upperMessage === 'ACEPTO') {
        setUserStatus('accepted')
      } else if (upperMessage === 'SALIR' || message.toLowerCase().trim() === '/salir') {
        setUserStatus('opt_out')
      }

      // Enviar a N8N
      const response = await sendToN8N(message)
      
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        isBot: true,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])

      // Actualizar status basado en la respuesta si es necesario
      if (upperMessage === 'ACEPTO' && userStatus !== 'accepted') {
        setUserStatus('normal')
      }

    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const sendToN8N = async (message) => {
    try {
      // Usar el servicio real de N8N
      const response = await n8nService.sendMessage(message)
      return response
    } catch (error) {
      // Si falla la conexión con N8N, usar respuesta de fallback
      console.error('Error connecting to N8N:', error)
      return 'Lo siento, no puedo conectarme con el servidor en este momento. Por favor, verifica la configuración de N8N.'
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-200 h-[700px] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Chat Assistant</h2>
              <p className="text-blue-100 text-sm opacity-90">
                Powered by N8N • ID: {n8nService.getUserId().slice(-6)}
              </p>
            </div>
          </div>
          
          {/* Indicador de estado */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              userStatus === 'accepted' || userStatus === 'normal' 
                ? 'bg-green-400' 
                : userStatus === 'opt_out' 
                ? 'bg-red-400' 
                : 'bg-yellow-400'
            }`}></div>
            <span className="text-sm text-blue-100">
              {userStatus === 'accepted' || userStatus === 'normal' ? 'Conectado' : 
               userStatus === 'opt_out' ? 'Desconectado' : 'Esperando confirmación'}
            </span>
          </div>
        </div>
      </div>
      
      <MessageList 
        messages={messages} 
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />
      
      <MessageInput 
        onSendMessage={sendMessage}
        disabled={isLoading}
        userStatus={userStatus}
      />
    </div>
  )
}

export default ChatContainer