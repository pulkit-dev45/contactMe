// API Helper Functions
const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function apiCall(endpoint, method = 'GET', data = null) {
    const token = localStorage.getItem('access_token');
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (response.status === 401) {
            // Token expired, redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            showError('Session expired. Please login again.');
            setTimeout(() => {
                window.location.href = '/login/';
            }, 1000);
            return null;
        }

        if (response.ok) {
            return await response.json();
        } else {
            const errorMsg = await handleApiError(response);
            throw new Error(errorMsg);
        }
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth Functions
async function login(username, password) {
    return apiCall('/token/', 'POST', { username, password });
}

async function register(username, email, password) {
    return apiCall('/auth/register/', 'POST', { username, email, password });
}

function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login/';
}

// Contact Functions
async function getContacts() {
    return apiCall('/contacts/');
}

async function getContact(id) {
    return apiCall(`/contacts/${id}/`);
}

async function createContact(contactData) {
    return apiCall('/contacts/', 'POST', contactData);
}

async function updateContact(id, contactData) {
    return apiCall(`/contacts/${id}/`, 'PUT', contactData);
}

async function deleteContact(id) {
    return apiCall(`/contacts/${id}/`, 'DELETE');
}
