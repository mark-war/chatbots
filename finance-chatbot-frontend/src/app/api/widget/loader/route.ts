import { NextResponse } from 'next/server';

export async function GET() {
  const script = `
<script>
class FinanceChatWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = \`
      <style>
        .chat-bubble {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          z-index: 10000;
          font-size: 24px;
          color: white;
          transition: transform 0.2s;
        }
        .chat-bubble:hover { transform: scale(1.1); }
        .chat-modal {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 380px;
          height: 500px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          z-index: 10000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .chat-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          text-align: center;
          font-weight: bold;
        }
        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: #f8fafc;
        }
        .message {
          margin-bottom: 15px;
        }
        .user-message {
          text-align: right;
        }
        .bot-message {
          text-align: left;
        }
        .message-bubble {
          display: inline-block;
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 18px;
          word-wrap: break-word;
        }
        .user-bubble {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .bot-bubble {
          background: white;
          color: #374151;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .chat-input {
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 10px;
        }
        .input-field {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 25px;
          outline: none;
        }
        .send-btn {
          padding: 12px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
        }
      </style>
      <div class="chat-bubble" onclick="toggleChat()">💬</div>
      <div class="chat-modal" id="chatModal" style="display:none;">
        <div class="chat-header">AI Finance Assistant</div>
        <div class="chat-messages" id="messages"></div>
        <div class="chat-input">
          <input type="text" class="input-field" id="input" placeholder="Ask about your money..." onkeypress="if(event.key==='Enter') sendMessage()">
          <button class="send-btn" onclick="sendMessage()">Send</button>
        </div>
      </div>
    \`;
    window.toggleChat = () => {
      const modal = this.shadowRoot.querySelector('#chatModal');
      modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
    };
    window.sendMessage = async () => {
      const input = this.shadowRoot.querySelector('#input');
      const messages = this.shadowRoot.querySelector('#messages');
      const question = input.value.trim();
      if (!question) return;
      addMessage('user', question);
      input.value = '';
      const res = await fetch('http://localhost:4000/api/chat/query', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({question, userId: '${this.getAttribute('data-user-id') || 'demo'}'})
      });
      const data = await res.json();
      addMessage('bot', data.answer || 'Error');
    };
    window.addMessage = (role, text) => {
      const messages = document.querySelector('#messages');
      const div = document.createElement('div');
      div.className = \`message \${role}-message\`;
      div.innerHTML = \`<div class="message-bubble \${role}-bubble">\${text}</div>\`;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    };
  }
}
customElements.define('finance-chat', FinanceChatWidget);
</script>
  `;
  return new NextResponse(script, {
    headers: { 'Content-Type': 'text/javascript' },
  });
}