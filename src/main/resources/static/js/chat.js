const userId = document.getElementById('userId').value;
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const loading = document.getElementById('loading');

loadHistory();

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = messageInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    messageInput.value = '';

    sendBtn.disabled = true;
    messageInput.disabled = true;
    loading.style.display = 'block';

    try {
        const response = await fetch('/chat/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `userId=${encodeURIComponent(userId)}&message=${encodeURIComponent(message)}`
        });

        const llmResponse = await response.text();
        addMessage(llmResponse, 'llm');

    } catch (error) {
        addMessage('Error: No se pudo obtener respuesta', 'llm');
        console.error('Error:', error);
    } finally {
        sendBtn.disabled = false;
        messageInput.disabled = false;
        loading.style.display = 'none';
        messageInput.focus();
    }
});

async function loadHistory() {
    try {
        const response = await fetch(`/chat/history?userId=${encodeURIComponent(userId)}`);
        const history = await response.json();

        history.forEach(conv => {
            addMessage(conv.userMessage, 'user', conv.timestamp, false);
            addMessage(conv.llmResponse, 'llm', conv.timestamp, false);
        });

        scrollToBottom();
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

function addMessage(text, type, timestamp = null, scroll = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;

    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = timestamp ? formatTime(timestamp) : formatTime(new Date());

    messageDiv.appendChild(bubble);
    messageDiv.appendChild(time);
    chatMessages.appendChild(messageDiv);

    if (scroll) {
        scrollToBottom();
    }
}

function formatTime(date) {
    const d = new Date(date);
    return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
