import { useState } from 'react'

const MessageInput = ({ onSendMessage, disabled, userStatus }) => {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue)
      setInputValue('')
    }
  }

  const handleQuickAction = (action) => {
    if (!disabled) {
      onSendMessage(action)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const getQuickActions = () => {
    switch (userStatus) {
      case 'need_opt_in':
        return [] // No mostrar botones hasta que acepte
      case 'accepted':
      case 'normal':
        return [
          { text: '📋 /politica', action: '/politica', color: 'bg-blue-600 hover:bg-blue-700' },
          { text: '📚 /fuentes', action: '/fuentes', color: 'bg-purple-600 hover:bg-purple-700' },
          { text: '⚡ /breve', action: '/breve', color: 'bg-green-600 hover:bg-green-700' },
          { text: '📝 /extendido', action: '/extendido', color: 'bg-orange-600 hover:bg-orange-700' },
          { text: '🤖 /modelos', action: '/modelos', color: 'bg-indigo-600 hover:bg-indigo-700' },
          { text: '🔥 /gpt', action: '/gpt', color: 'bg-emerald-600 hover:bg-emerald-700' },
          { text: '⭐ /mistral', action: '/mistral', color: 'bg-violet-600 hover:bg-violet-700' },
          { text: '🚪 /salir', action: '/salir', color: 'bg-red-600 hover:bg-red-700' }
        ]
      case 'opt_out':
        return [] // No mostrar botones cuando el usuario sale
      default:
        return []
    }
  }

  return (
    <div className="border-t border-blue-100 bg-white/50 backdrop-blur-sm p-6">
      {/* Botones de acción rápida */}
      {getQuickActions().length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Acciones rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {getQuickActions().map((quickAction, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(quickAction.action)}
                disabled={disabled}
                className={`px-3 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md ${quickAction.color}`}
              >
                {quickAction.text}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={userStatus === 'need_opt_in' ? 'Escribe para continuar...' : 'Escribe tu mensaje aquí...'}
            disabled={disabled}
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 text-gray-800 placeholder-gray-500"
          />
          {inputValue && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="text-blue-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4v16l5-3 5 3V4M7 4h10" />
                </svg>
              </div>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={disabled || !inputValue.trim()}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 font-medium shadow-lg"
        >
          {disabled ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>
    </div>
  )
}

export default MessageInput