// Mute/Unmute functionality
const muteButton = document.getElementById('mute-btn');
let isMuted = false;

muteButton.addEventListener('click', () => {
    const audioTracks = localStream.getAudioTracks();
    if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        isMuted = !isMuted;
        muteButton.textContent = isMuted ? 'Unmute' : 'Mute';
    }
});

// Camera On/Off functionality
const cameraButton = document.getElementById('camera-btn');
let isCameraOn = true;

cameraButton.addEventListener('click', () => {
    const videoTracks = localStream.getVideoTracks();
    if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        isCameraOn = videoTracks[0].enabled;
        cameraButton.textContent = isCameraOn ? 'Camera Off' : 'Camera On';
    }
});

// Start the media stream for local video
let localStream;

async function startMedia() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const localVideo = document.getElementById('local-video');
        localVideo.srcObject = localStream;
    } catch (err) {
        console.error('Error accessing media devices:', err);
    }
}
startMedia();

// Toggle Chat visibility
const showChatButton = document.getElementById('show-chat-btn');
const chatBox = document.getElementById('chat-box');
let isChatVisible = false;

showChatButton.addEventListener('click', () => {
    isChatVisible = !isChatVisible;
    chatBox.style.display = isChatVisible ? 'block' : 'none';
    showChatButton.textContent = isChatVisible ? 'Hide Chat' : 'Show Chat';
});

// Toggle Participants List visibility
const showParticipantsButton = document.getElementById('show-participants-btn');
const participantsList = document.getElementById('participants-list');
let isParticipantsVisible = false;

showParticipantsButton.addEventListener('click', () => {
    isParticipantsVisible = !isParticipantsVisible;
    participantsList.style.display = isParticipantsVisible ? 'block' : 'none';
    showParticipantsButton.textContent = isParticipantsVisible ? 'Hide Participants' : 'Show Participants';
});

// Raise Hand functionality
const raiseHandButton = document.getElementById('raise-hand-btn');
let isHandRaised = false;
const participantsListItems = document.querySelectorAll('#participants-list li');

// Toggle Raise Hand functionality
raiseHandButton.addEventListener('click', () => {
    isHandRaised = !isHandRaised;
    raiseHandButton.textContent = isHandRaised ? 'Lower Hand' : 'Raise Hand';

    // Assuming Participant 1 raises hand for demo purposes
    if (isHandRaised) {
        participantsListItems[0].textContent = 'Participant 1 ✋';
    } else {
        participantsListItems[0].textContent = 'Participant 1';
    }
});

// Leave Meeting functionality
const leaveButton = document.getElementById('leave-btn');
leaveButton.addEventListener('click', () => {
    window.location.href = 'post_meeting_summary.html';  // Redirect to post-meeting summary page
});

// Chat functionality
const chatInput = document.getElementById('chat-input');
const chatMessages = document.querySelector('.chat-messages');

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && chatInput.value.trim() !== '') {
        const message = chatInput.value;
        displayMessage(`You: ${message}`);
        chatInput.value = ''; // Clear the input field
        // TODO: Implement sending the message to other participants
    }
});

function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the latest message
}
