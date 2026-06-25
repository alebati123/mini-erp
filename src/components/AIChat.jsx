import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send } from 'lucide-react';
import { procesarComandoIA } from '../services/aiService';
import { useAppContext } from '../context/AppContext';

const AIChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: '¡Hola! Soy tu asistente IA. Dime qué compraste o vendiste hoy en Abshine o ab3D.impresiones.', sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { updateInventoryAndBalance } = useAppContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { id: Date.now(), text: userMessage, sender: 'user' }]);
    setIsLoading(true);

    try {
      const responseJSON = await procesarComandoIA(userMessage);
      
      updateInventoryAndBalance(
        responseJSON.operacion,
        responseJSON.negocio,
        responseJSON.producto,
        responseJSON.cantidad,
        responseJSON.precio
      );

      const successMessage = `Entendido. Registré una ${responseJSON.operacion} de ${responseJSON.cantidad} unidad(es) de "${responseJSON.producto}" para ${responseJSON.negocio}.`;
      setMessages(prev => [...prev, { id: Date.now(), text: successMessage, sender: 'ai' }]);
      
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now(), text: "Hubo un error procesando tu solicitud.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel chat-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
        <div style={{ background: 'var(--accent-abshine-glow)', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
          <Bot color="var(--accent-abshine)" size={24} />
        </div>
        <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Asistente IA</h2>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message ai">
            <span style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>Analizando comando...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-wrapper">
        <input 
          type="text" 
          placeholder="Ej: Vendí 3 microfibras a 3000..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <button className="btn-primary" onClick={handleSend} disabled={isLoading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default AIChat;
