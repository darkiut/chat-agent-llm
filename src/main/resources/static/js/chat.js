const userId = document.getElementById('userId').value;
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const loading = document.getElementById('loading');
const currentModelInput = document.getElementById('currentModel');
const useGptBtn = document.getElementById('useGptBtn');
const useToyBtn = document.getElementById('useToyBtn');

let currentModel = 'gpt'; // 'gpt' o 'toy'

// Cargar historial al iniciar
loadHistory();

// Cambiar modelo
useGptBtn.addEventListener('click', () => {
    currentModel = 'gpt';
    currentModelInput.value = 'gpt';
    useGptBtn.classList.add('active');
    useToyBtn.classList.remove('active');
    messageInput.placeholder = 'Escribe tu mensaje para GPT-3.5...';
});

useToyBtn.addEventListener('click', () => {
    currentModel = 'toy';
    currentModelInput.value = 'toy';
    useToyBtn.classList.add('active');
    useGptBtn.classList.remove('active');
    messageInput.placeholder = 'Escribe tu mensaje para LLM Toy (ej: la suma de)...';
});

// Manejar envío de mensajes
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = messageInput.value.trim();
    if (!message) return;

    // Mostrar mensaje del usuario
    addMessage(message, 'user');
    messageInput.value = '';

    // Deshabilitar input mientras se espera respuesta
    sendBtn.disabled = true;
    messageInput.disabled = true;
    loading.style.display = 'block';

    try {
        if (currentModel === 'gpt') {
            await sendToGPT(message);
        } else {
            await sendToToy(message);
        }
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

async function sendToGPT(message) {
    const response = await fetch('/chat/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `userId=${encodeURIComponent(userId)}&message=${encodeURIComponent(message)}`
    });

    const llmResponse = await response.text();
    addMessage(llmResponse, 'llm');
}

async function sendToToy(message) {
    const response = await fetch('/chat/send-toy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `userId=${encodeURIComponent(userId)}&message=${encodeURIComponent(message)}`
    });

    const result = await response.json();

    // Mostrar tokens generados
    const tokensText = result.tokens.join(' ');
    addMessage(tokensText, 'llm');

    // Mostrar tabla de probabilidades
    addProbabilitiesTable(result.probabilities_table);
}

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

function addProbabilitiesTable(probsData) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message llm';

    const tableContainer = document.createElement('div');
    tableContainer.className = 'prob-table';

    let tableHTML = `
        <h4 style="margin: 0 0 10px 0; color: #667eea;">📊 Tabla de Probabilidades</h4>
        <table>
            <thead>
                <tr>
                    <th>Pos</th>
                    <th>Token</th>
                    <th>Prob</th>
                    <th>Logprob</th>
                    <th>Alt1</th>
                    <th>Alt2</th>
                    <th>Alt3</th>
                </tr>
            </thead>
            <tbody>
    `;

    probsData.forEach(row => {
        tableHTML += `
            <tr>
                <td>${row['Posición']}</td>
                <td><strong>${row['Token generado']}</strong></td>
                <td>${row['Probabilidad'].toFixed(4)}</td>
                <td>${row['Logprob'].toFixed(4)}</td>
                <td>${row['Top1_alt_prob'].toFixed(4)}</td>
                <td>${row['Top2_alt_prob'].toFixed(4)}</td>
                <td>${row['Top3_alt_prob'].toFixed(4)}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = tableHTML;

    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = formatTime(new Date());

    messageDiv.appendChild(tableContainer);
    messageDiv.appendChild(time);
    chatMessages.appendChild(messageDiv);

    scrollToBottom();
}

function formatTime(date) {
    const d = new Date(date);
    return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
