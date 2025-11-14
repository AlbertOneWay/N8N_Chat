const Message = ({ message }) => {
  const { text, isBot, timestamp } = message

  // Función para formatear el texto con negritas y cursivas
  const formatText = (text) => {
    if (!text) return text
    
    // Dividir el texto en líneas para manejar mejor los saltos
    const lines = text.split('\n')
    
    return lines.map((line, lineIndex) => {
      // Procesar cada línea para encontrar formateo
      const parts = line.split(/(\*\*.*?\*\*|_.*?_)/g)
      
      const formattedLine = parts.map((part, partIndex) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          // Texto en negrita
          return (
            <strong key={`${lineIndex}-${partIndex}`} className="font-bold text-blue-800">
              {part.slice(2, -2)}
            </strong>
          )
        } else if (part.startsWith('_') && part.endsWith('_') && part.length > 2) {
          // Texto en cursiva
          return (
            <em key={`${lineIndex}-${partIndex}`} className="italic">
              {part.slice(1, -1)}
            </em>
          )
        } else {
          // Texto normal
          return <span key={`${lineIndex}-${partIndex}`}>{part}</span>
        }
      })
      
      return (
        <div key={lineIndex}>
          {formattedLine}
          {lineIndex < lines.length - 1 && <br />}
        </div>
      )
    })
  }

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${ 
        isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'
      }`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${ 
          isBot 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
            : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
        }`}>
          {isBot ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        
        {/* Message Bubble */}
        <div className="flex flex-col">
          <div
            className={`px-4 py-3 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 ${ 
              isBot
                ? 'bg-white border border-blue-100 text-gray-800 rounded-bl-sm'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-sm'
            }`}
          >
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {formatText(text)}
            </div>
          </div>
          
          {/* Timestamp */}
          <p className={`text-xs mt-1 px-2 ${ 
            isBot 
              ? 'text-gray-500 text-left' 
              : 'text-blue-300 text-right'
          }`}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Message