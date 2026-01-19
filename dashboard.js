const API_BASE_URL = 'http://localhost:3000/api';

let allResponses = [];

// DOM Elements
const responsesBody = document.getElementById('responsesBody');
const totalRSVPs = document.getElementById('totalRSVPs');
const totalAccepted = document.getElementById('totalAccepted');
const totalGuests = document.getElementById('totalGuests');
const totalDeclined = document.getElementById('totalDeclined');
const guestSearch = document.getElementById('guestSearch');
const exportBtn = document.getElementById('exportBtn');

// Initialize
async function init() {
    await fetchResponses();

    // Event listeners
    guestSearch.addEventListener('input', (e) => {
        filterResponses(e.target.value);
    });

    exportBtn.addEventListener('click', () => {
        window.location.href = `${API_BASE_URL}/admin/export`;
    });
}

async function fetchResponses() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/responses`);
        if (!response.ok) throw new Error('Failed to fetch responses');
        allResponses = await response.json();
        renderDashboard(allResponses);
    } catch (error) {
        console.error('Error:', error);
        responsesBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem;">Error loading data. Is the server running?</td></tr>`;
    }
}

function renderDashboard(data) {
    renderStats(data);
    renderTable(data);
}

function renderStats(data) {
    const acceptedList = data.filter(r => r.status === 'ACCEPTED');
    const declinedList = data.filter(r => r.status === 'REJECTED');

    totalRSVPs.innerText = data.length;
    totalAccepted.innerText = acceptedList.length;
    totalDeclined.innerText = declinedList.length;

    const guestsCount = acceptedList.reduce((acc, curr) => acc + (curr.attendees || 0), 0);
    totalGuests.innerText = guestsCount;
}

function renderTable(data) {
    if (data.length === 0) {
        responsesBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem;">No responses found.</td></tr>`;
        return;
    }

    responsesBody.innerHTML = data.map(row => `
        <tr>
            <td>
                <div class="guest-info">
                    <span class="name">${row.name}</span>
                    <span class="email">${row.email || 'N/A'}</span>
                </div>
            </td>
            <td>
                <span class="status-badge status-${row.status.toLowerCase()}">${row.status}</span>
            </td>
            <td>${row.attendees || '-'}</td>
            <td>
                <div class="notes-cell">${row.notes || row.reason || '-'}</div>
            </td>
            <td>
                <div class="timestamp">${new Date(row.timestamp).toLocaleDateString()}</div>
            </td>
        </tr>
    `).join('');
}

function filterResponses(query) {
    const filtered = allResponses.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        (r.email && r.email.toLowerCase().includes(query.toLowerCase())) ||
        (r.notes && r.notes.toLowerCase().includes(query.toLowerCase())) ||
        (r.reason && r.reason.toLowerCase().includes(query.toLowerCase()))
    );
    renderTable(filtered);
}

init();
