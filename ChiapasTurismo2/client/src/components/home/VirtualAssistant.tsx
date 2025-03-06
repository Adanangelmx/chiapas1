import React, { useState } from 'react';
import { Send } from 'lucide-react';
import '@/styles/VirtualAssistant.css';
import { Link } from 'wouter';

export function VirtualAssistant() {
  const [question, setQuestion] = useState<string>('');

  return (
    <div className="virtual-assistant">
      <div className="virtual-assistant-header">
        <h2>Asistente Virtual de Viajes</h2>
        <p>
          Pregunta sobre destinos, tradiciones, gastronomía o cualquier aspecto de tu viaje a Chiapas
        </p>
      </div>

      <div className="virtual-assistant-content">
        <div>
          <div className="input-container">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="¿Qué deseas saber sobre Chiapas?"
              className="question-input"
            />
            <Link to={`/chat?query=${encodeURIComponent(question)}`}>
              <button className="send-button">
                <Send className="h-5 w-5" />
              </button>
            </Link>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Haz tu pregunta y serás dirigido a nuestro asistente de viajes inteligente.
          </p>
        </div>
      </div>
    </div>
  );
} 