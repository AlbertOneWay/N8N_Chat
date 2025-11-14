import Message from './Message'
import LoadingMessage from './LoadingMessage'

const MessageList = ({ messages, isLoading, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-blue-50/50 to-white/50">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {isLoading && <LoadingMessage />}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList