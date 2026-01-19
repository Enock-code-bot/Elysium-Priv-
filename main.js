// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const TOKEN = 'test-event-2026'; // Hardcoded for this demo, usually from URL

let invitationData = null;

// DOM Elements
const actionButtons = document.getElementById('actionButtons');
const acceptForm = document.getElementById('acceptForm');
const declineForm = document.getElementById('declineForm');
const successScreen = document.getElementById('successScreen');
const declineScreen = document.getElementById('declineScreen');
const mainMessage = document.querySelector('.message');
const eventDetails = document.querySelector('.event-details');

// Initialize
async function init() {
    try {
        const response = await fetch(`${API_BASE_URL}/invitation/${TOKEN}`);
        if (!response.ok) throw new Error('Invitation not found');
        invitationData = await response.json();
        updateUIWithData(invitationData);
    } catch (error) {
        console.error('Error fetching invitation:', error);
        // Fallback or error message if backend is not running
        mainMessage.innerText = "Error loading invitation. Please try again later.";
    }
}

function updateUIWithData(data) {
    document.querySelector('.tagline').innerHTML = `You have been <span>personally</span> invited to ${data.event_name}.`;
    if (data.message) mainMessage.innerText = data.message;

    const details = document.querySelectorAll('.value');
    details[0].innerText = data.event_date;
    details[1].innerText = data.event_location;
    // RSVP value (details[2]) stays as is or can be updated
}

// Event Handlers
document.getElementById('acceptBtn').addEventListener('click', () => {
    showSection(acceptForm);
});

document.getElementById('declineBtn').addEventListener('click', () => {
    showSection(declineForm);
});

document.getElementById('backToActions1').addEventListener('click', () => showSection(actionButtons));
document.getElementById('backToActions2').addEventListener('click', () => showSection(actionButtons));

// Form Submissions
document.getElementById('rsvpAcceptForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        invitation_id: invitationData ? invitationData.id : 1,
        name: document.getElementById('guestName').value,
        email: document.getElementById('guestEmail').value,
        attendees: parseInt(document.getElementById('guestAttendees').value),
        notes: document.getElementById('guestNotes').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/rsvp/accept`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            showSection(successScreen);
        } else {
            alert('Error submitting RSVP. Please try again.');
        }
    } catch (error) {
        console.error('RSVP Error:', error);
        alert('Network error. Is the server running?');
    }
});

document.getElementById('rsvpDeclineForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        invitation_id: invitationData ? invitationData.id : 1,
        name: document.getElementById('declineGuestName').value,
        reason: document.getElementById('declineReason').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/rsvp/reject`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            showSection(declineScreen);
        } else {
            alert('Error submitting response.');
        }
    } catch (error) {
        console.error('Rejection Error:', error);
        alert('Network error.');
    }
});

function showSection(section) {
    [actionButtons, acceptForm, declineForm, successScreen, declineScreen].forEach(s => {
        if (s) s.style.display = 'none';
    });
    section.style.display = 'flex';
}

// Subtle parallax effect on mouse move
document.addEventListener('mousemove', (e) => {
    const card = document.querySelector('.invite-card');
    const xAxis = (window.innerWidth / 2 - e.pageX) / 80;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 80;
    card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

init();
