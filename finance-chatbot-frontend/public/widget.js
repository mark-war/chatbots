// public/widget.js
(function () {
  const script = document.currentScript;
  const userId = script.getAttribute("data-user-id") || "demo";
  const apiUrl =
    script.getAttribute("data-api-url") || "https://your-backend.onrender.com";

  const style = document.createElement("style");
  style.textContent = `
    .ai-portfolio { font-family: system-ui, sans-serif; max-width: 420px; margin: 0 auto; border: 1px solid #ddd; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .ai-header { background: #1e40af; color: white; padding: 1rem; text-align: center; font-weight: 600; }
    .ai-chat { height: 380px; padding: 1rem; background: #f8fafc; overflow-y: auto; }
    .ai-msg { margin: 0.5rem 0; padding: 0.75rem 1rem; border-radius: 12px; max-width: 85%; }
    .ai-user { background: #3b82f6; color: white; margin-left: auto; }
    .ai-bot { background: white; border: 1px solid #e2e8f0; }
    .ai-input { display: flex; padding: 0.75rem; background: white; border-top: 1px solid #e2e8f0; }
    .ai-input input { flex: 1; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 8px; }
    .ai-input button { margin-left: 0.5rem; background: #10b981; color: white; border: none; padding: 0 1rem; border-radius: 8px; cursor: pointer; }
  `;
  document.head.appendChild(style);

  const container = document.createElement("div");
  container.className = "ai-portfolio";
  container.innerHTML = `
    <div class="ai-header">AI Portfolio Guide</div>
    <div class="ai-chat" id="ai-chat"></div>
    <div class="ai-input">
      <input type="text" placeholder="Ask about your portfolio..." id="ai-input" />
      <button>Ask</button>
    </div>
  `;
  document.body.appendChild(container);

  const chat = document.getElementById("ai-chat");
  const input = document.getElementById("ai-input");
  const button = container.querySelector("button");

  const addMsg = (role, text) => {
    const div = document.createElement("div");
    div.className = `ai-msg ai-${role}`;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  };

  button.onclick = async () => {
    const q = input.value.trim();
    if (!q) return;
    addMsg("user", q);
    input.value = "";

    const res = await fetch(`${apiUrl}/api/portfolio/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q, userId }),
    });
    const data = await res.json();
    addMsg("bot", data.answer || "No response");
  };

  input.addEventListener(
    "keypress",
    (e) => e.key === "Enter" && button.click()
  );
})();
