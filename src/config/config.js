// Configuración de la aplicación
export const APP_CONFIG = {
  n8n: {
    // URL del webhook de N8N
    webhookUrl: 'https://n8n.srv1083463.hstgr.cloud/webhook/189db83e-9049-40de-840f-a99cbd248657',
  },
  
  chat: {
    title: 'Chat con N8N Bot',
    welcomeMessage: '¡Hola! Soy tu asistente de IA de la Universidad de Caldas.',
    maxMessageLength: 500,
    typingDelay: 1000
  }
}

export default APP_CONFIG