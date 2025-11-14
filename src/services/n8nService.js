import { APP_CONFIG } from '../config/config'

// Configuración para la API de N8N
const N8N_CONFIG = {
  webhookUrl: APP_CONFIG.n8n.webhookUrl
}

export class N8NService {
  constructor(config = N8N_CONFIG) {
    this.config = config
    this.currentUserId = this.generateUserId()
  }

  /**
   * Genera un ID único para el usuario web
   */
  generateUserId() {
    return 'web-' + Math.random().toString(36).substr(2, 9)
  }

  /**
   * Envía un mensaje al bot de N8N con el formato esperado por tu código
   * @param {string} message - El mensaje del usuario
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<string>} - Respuesta del bot
   */
  async sendMessage(message, options = {}) {
    try {
      // Formato que simula el webhook trigger de Telegram para tu código N8N
      const payload = {
        message: {
          text: message,
          from: {
            id: this.currentUserId,
            first_name: options.firstName || 'Usuario Web',
            username: options.username || 'web_user',
            is_bot: false
          },
          chat: {
            id: this.currentUserId,
            type: 'private'
          },
          date: Math.floor(Date.now() / 1000),
          message_id: Math.floor(Math.random() * 10000)
        },
        // Datos adicionales que pueden ser útiles
        update_id: Math.floor(Math.random() * 10000),
        source: 'web_chat'
      }

      console.log('🚀 Enviando al N8N:', JSON.stringify(payload, null, 2))
      console.log('📍 URL:', this.config.webhookUrl)

      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'N8N-WebChat/1.0',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      let data
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
        console.log('📥 Response data:', data)
      } else {
        data = await response.text()
        console.log('📥 Response text:', data)
      }
      
      // Manejar diferentes formatos de respuesta
      return this.extractResponse(data)
      
    } catch (error) {
      console.error('💥 Error completo al comunicarse con N8N:', error)
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('No se pudo conectar con N8N. Verifica que el webhook esté activo y la URL sea correcta.')
      }
      
      throw new Error(`Error de N8N: ${error.message}`)
    }
  }

  /**
   * Extrae la respuesta del formato devuelto por N8N
   */
  extractResponse(data) {
    console.log('🔍 Procesando respuesta:', data)
    
    let responseText = ''
    
    // Si N8N devuelve un array de resultados
    if (Array.isArray(data)) {
      console.log('📋 Respuesta es array, length:', data.length)
      if (data.length > 0) {
        const lastResult = data[data.length - 1]
        console.log('📄 Último resultado:', lastResult)
        responseText = lastResult.text || lastResult.message || lastResult.response || lastResult.output || 'Mensaje procesado (array)'
      }
    }
    // Si es un objeto directo
    else if (typeof data === 'object' && data !== null) {
      console.log('🔧 Respuesta es objeto:', Object.keys(data))
      
      // Buscar campos comunes de respuesta
      const possibleFields = ['text', 'message', 'response', 'output', 'reply', 'answer', 'result']
      for (const field of possibleFields) {
        if (data[field]) {
          console.log(`✅ Encontrado campo: ${field}`, data[field])
          responseText = data[field]
          break
        }
      }
      
      // Si no hay campos conocidos, devolver el objeto como string
      if (!responseText) {
        responseText = JSON.stringify(data)
      }
    }
    // Si es texto directo
    else if (typeof data === 'string') {
      console.log('📝 Respuesta es string:', data)
      responseText = data
    }
    else {
      console.log('❓ Tipo de respuesta desconocido:', typeof data)
      responseText = 'Mensaje procesado correctamente'
    }
    
    // Limpiar HTML tags y formatear para texto plano
    return this.cleanHtmlResponse(responseText)
  }

  /**
   * Limpia las etiquetas HTML y convierte a texto plano legible
   */
  cleanHtmlResponse(htmlText) {
    if (!htmlText || typeof htmlText !== 'string') {
      return htmlText
    }
    
    console.log('🧹 Texto original:', htmlText)
    
    // Convertir etiquetas HTML comunes a formato de texto
    let cleanText = htmlText
      // Negritas - convertir <b> y </b> a **
      .replace(/<b>/g, '**')
      .replace(/<\/b>/g, '**')
      .replace(/<strong>/g, '**')
      .replace(/<\/strong>/g, '**')
      // Cursiva
      .replace(/<i>/g, '_')
      .replace(/<\/i>/g, '_')
      .replace(/<em>/g, '_')
      .replace(/<\/em>/g, '_')
      // Saltos de línea y párrafos
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<p[^>]*>/gi, '')
      .replace(/<\/div>/gi, '\n')
      .replace(/<div[^>]*>/gi, '')
      // Eliminar cualquier otra etiqueta HTML restante
      .replace(/<[^>]*>/g, '')
      // Decodificar entidades HTML comunes
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Limpiar espacios múltiples y saltos de línea excesivos
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/^\s+|\s+$/g, '') // trim
    
    console.log('✨ Texto limpio:', cleanText)
    
    return cleanText
  }

  /**
   * Actualiza la configuración del servicio
   * @param {Object} newConfig - Nueva configuración
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Obtiene el ID del usuario actual
   */
  getUserId() {
    return this.currentUserId
  }

  /**
   * Cambia el ID del usuario (útil para simular diferentes usuarios)
   */
  setUserId(newUserId) {
    this.currentUserId = newUserId || this.generateUserId()
  }

  /**
   * Verifica si la conexión con N8N está disponible
   * @returns {Promise<boolean>} - True si la conexión es exitosa
   */
  async testConnection() {
    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'HEAD'
      })
      return response.ok || response.status === 405 // 405 Method Not Allowed es OK para webhooks
    } catch (error) {
      console.error('Error al probar conexión con N8N:', error)
      return false
    }
  }
}

// Instancia por defecto
export const n8nService = new N8NService()