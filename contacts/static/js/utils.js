// Message Display System
// Replaces all window alerts with elegant website messages

function showMessage(message, type = 'info', duration = 4000) {
    const container = document.getElementById('messageContainer');
    if (!container) return;

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.innerHTML = `
        <div class="message-content">
            <span class="message-icon">${getMessageIcon(type)}</span>
            <span class="message-text">${escapeHtml(message)}</span>
            <button class="message-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    container.appendChild(messageEl);

    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (messageEl.parentElement) {
                messageEl.style.animation = 'slideOut 0.3s ease-in forwards';
                setTimeout(() => messageEl.remove(), 300);
            }
        }, duration);
    }
}

function showSuccess(message, duration = 4000) {
    showMessage(message, 'success', duration);
}

function showError(message, duration = 5000) {
    showMessage(message, 'error', duration);
}

function showWarning(message, duration = 4000) {
    showMessage(message, 'warning', duration);
}

function showInfo(message, duration = 4000) {
    showMessage(message, 'info', duration);
}

function getMessageIcon(type) {
    const icons = {
        'success': '✓',
        'error': '✕',
        'warning': '⚠',
        'info': 'ℹ'
    };
    return icons[type] || 'ℹ';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Helper to extract and display error messages from API responses
async function handleApiError(response) {
    try {
        const data = await response.json();
        
        // Handle different error formats
        if (data.detail) {
            return data.detail;
        }
        
        // Handle field-level errors (serializer errors)
        if (typeof data === 'object') {
            const errors = [];
            for (const [field, messages] of Object.entries(data)) {
                if (Array.isArray(messages)) {
                    errors.push(`${field}: ${messages.join(', ')}`);
                } else {
                    errors.push(`${field}: ${messages}`);
                }
            }
            if (errors.length > 0) {
                return errors.join('\n');
            }
        }
        
        return JSON.stringify(data);
    } catch (e) {
        return 'An error occurred. Please try again.';
    }
}
