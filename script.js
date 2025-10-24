// Dating Chat App JavaScript

// Sample data for matches and profiles
const profiles = [
    {
        id: 1,
        name: "Sofia",
        age: 25,
        photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
        bio: "Amante dei viaggi e della fotografia. Cerco qualcuno con cui condividere avventure e momenti speciali.",
        interests: ["Viaggi", "Fotografia", "Cucina", "Yoga"],
        online: true,
        lastSeen: "Online ora",
        messages: [
            { text: "Ciao! Come va?", time: "14:30", sent: false },
            { text: "Tutto bene, grazie! Tu come stai?", time: "14:32", sent: true },
            { text: "Benissimo! Ho visto che ti piace viaggiare, qual è la tua destinazione preferita?", time: "14:35", sent: false },
            { text: "Adoro il Giappone! Ci sono stata l'anno scorso ed è stato incredibile 🇯🇵", time: "14:37", sent: true }
        ]
    },
    {
        id: 2,
        name: "Marco",
        age: 28,
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        bio: "Sviluppatore software appassionato di musica e sport. Sempre pronto per nuove avventure!",
        interests: ["Programmazione", "Musica", "Calcio", "Cinema"],
        online: false,
        lastSeen: "Visto 2 ore fa",
        messages: [
            { text: "Hey! Mi piace molto il tuo profilo 😊", time: "12:15", sent: false },
            { text: "Grazie! Anche il tuo è interessante. Che tipo di musica ascolti?", time: "12:45", sent: true },
            { text: "Un po' di tutto, ma ultimamente sono fissato con il jazz. Tu?", time: "13:20", sent: false }
        ]
    },
    {
        id: 3,
        name: "Elena",
        age: 23,
        photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        bio: "Studentessa di arte, amante della natura e degli animali. Cerco qualcuno di autentico e sincero.",
        interests: ["Arte", "Natura", "Animali", "Lettura"],
        online: true,
        lastSeen: "Online ora",
        messages: [
            { text: "Ciao! Che bel tramonto nella tua foto!", time: "16:20", sent: false },
            { text: "Grazie! L'ho scattata durante un'escursione in montagna", time: "16:22", sent: true },
            { text: "Fantastico! Anche io adoro la montagna 🏔️", time: "16:25", sent: false },
            { text: "Dovremmo organizzare un'escursione insieme!", time: "16:27", sent: true }
        ]
    },
    {
        id: 4,
        name: "Alessandro",
        age: 30,
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        bio: "Chef professionista, amante del buon cibo e del vino. La vita è troppo breve per non godersi ogni momento!",
        interests: ["Cucina", "Vino", "Viaggi", "Libri"],
        online: false,
        lastSeen: "Visto 1 ora fa",
        messages: [
            { text: "Ciao bella! Ti va di cenare insieme stasera?", time: "19:30", sent: false },
            { text: "Ciao! Sarebbe bello, ma ho già altri impegni stasera", time: "19:45", sent: true },
            { text: "Nessun problema! Che ne dici di domani sera?", time: "19:47", sent: false },
            { text: "Domani sera potrebbe andare bene! 😊", time: "19:50", sent: true }
        ]
    }
];

// New potential matches for discovery
const potentialMatches = [
    {
        id: 5,
        name: "Giulia",
        age: 26,
        photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
        bio: "Architetto creativa, appassionata di design e arte contemporanea. Amo esplorare nuovi luoghi e culture.",
        interests: ["Architettura", "Design", "Arte", "Viaggi"]
    },
    {
        id: 6,
        name: "Luca",
        age: 27,
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
        bio: "Personal trainer e nutrizionista. Vivo per lo sport e il benessere. Cerco qualcuno che condivida la mia passione per uno stile di vita sano.",
        interests: ["Fitness", "Nutrizione", "Sport", "Benessere"]
    },
    {
        id: 7,
        name: "Chiara",
        age: 24,
        photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
        bio: "Giornalista freelance e blogger di viaggi. Sempre in cerca della prossima avventura da raccontare.",
        interests: ["Giornalismo", "Scrittura", "Viaggi", "Fotografia"]
    }
];

// Global variables
let currentChatId = null;
let currentPotentialMatch = null;
let typingTimeout = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadMatches();
    setupEventListeners();
});

// Load matches in sidebar
function loadMatches() {
    const matchesList = document.getElementById('matchesList');
    matchesList.innerHTML = '';

    profiles.forEach(profile => {
        const lastMessage = profile.messages[profile.messages.length - 1];
        const matchItem = document.createElement('div');
        matchItem.className = 'match-item';
        matchItem.onclick = () => openChat(profile.id);
        
        matchItem.innerHTML = `
            <img src="${profile.photo}" alt="${profile.name}" class="match-avatar">
            <div class="match-info">
                <div class="match-name">${profile.name}</div>
                <div class="match-preview">${lastMessage.text}</div>
            </div>
            <div class="match-time">${lastMessage.time}</div>
        `;
        
        matchesList.appendChild(matchItem);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Close modals when clicking outside
    window.onclick = function(event) {
        const profileModal = document.getElementById('profileModal');
        const newMatchModal = document.getElementById('newMatchModal');
        
        if (event.target === profileModal) {
            closeModal();
        }
        if (event.target === newMatchModal) {
            closeNewMatchModal();
        }
    };

    // Close emoji picker when clicking outside
    document.addEventListener('click', function(event) {
        const emojiPicker = document.getElementById('emojiPicker');
        const emojiBtn = document.querySelector('.emoji-btn');
        
        if (!emojiPicker.contains(event.target) && event.target !== emojiBtn) {
            emojiPicker.style.display = 'none';
        }
    });
}

// Open chat with a specific match
function openChat(profileId) {
    currentChatId = profileId;
    const profile = profiles.find(p => p.id === profileId);
    
    if (!profile) return;

    // Update active match in sidebar
    document.querySelectorAll('.match-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget?.classList.add('active');

    // Update chat header
    updateChatHeader(profile);
    
    // Load messages
    loadMessages(profile);
    
    // Show chat input
    document.getElementById('chatInputContainer').style.display = 'block';
}

// Update chat header with profile info
function updateChatHeader(profile) {
    document.getElementById('currentProfilePic').src = profile.photo;
    document.getElementById('currentProfileName').textContent = `${profile.name}, ${profile.age}`;
    
    const onlineStatus = document.getElementById('onlineStatus');
    onlineStatus.textContent = profile.online ? 'Online ora' : profile.lastSeen;
    onlineStatus.className = profile.online ? 'online-status' : 'online-status offline';
}

// Load messages for current chat
function loadMessages(profile) {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';

    profile.messages.forEach(message => {
        addMessageToChat(message, profile);
    });

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add a message to the chat
function addMessageToChat(message, profile) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sent ? 'sent' : 'received'}`;
    
    messageDiv.innerHTML = `
        ${!message.sent ? `<img src="${profile.photo}" alt="${profile.name}" class="message-avatar">` : ''}
        <div class="message-bubble">
            ${message.text}
            <div class="message-time">${message.time}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send a message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    
    if (!messageText || !currentChatId) return;

    const profile = profiles.find(p => p.id === currentChatId);
    if (!profile) return;

    // Create message object
    const newMessage = {
        text: messageText,
        time: getCurrentTime(),
        sent: true
    };

    // Add to profile messages
    profile.messages.push(newMessage);
    
    // Add to chat
    addMessageToChat(newMessage, profile);
    
    // Clear input
    messageInput.value = '';
    
    // Update matches list
    loadMatches();
    
    // Simulate typing and response
    simulateTyping(profile);
}

// Handle key press in message input
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Get current time formatted
function getCurrentTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + 
           now.getMinutes().toString().padStart(2, '0');
}

// Simulate typing indicator and auto-response
function simulateTyping(profile) {
    const chatMessages = document.getElementById('chatMessages');
    
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = `
        <img src="${profile.photo}" alt="${profile.name}" class="message-avatar">
        <span>${profile.name} sta scrivendo...</span>
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Remove typing indicator and send response after delay
    setTimeout(() => {
        chatMessages.removeChild(typingDiv);
        
        // Generate auto-response
        const responses = [
            "Interessante! Dimmi di più 😊",
            "Haha, sei divertente! 😄",
            "Sono d'accordo con te!",
            "Non ci avevo mai pensato così 🤔",
            "Mi piace il tuo punto di vista!",
            "Che bella idea! ✨",
            "Anche io la penso così!",
            "Raccontami altro! 😍"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const responseMessage = {
            text: randomResponse,
            time: getCurrentTime(),
            sent: false
        };
        
        profile.messages.push(responseMessage);
        addMessageToChat(responseMessage, profile);
        loadMatches();
        
    }, 2000 + Math.random() * 2000);
}

// Find new match
function findNewMatch() {
    if (potentialMatches.length === 0) {
        alert('Non ci sono nuovi match disponibili al momento. Riprova più tardi!');
        return;
    }
    
    // Get random potential match
    const randomIndex = Math.floor(Math.random() * potentialMatches.length);
    currentPotentialMatch = potentialMatches[randomIndex];
    
    // Show new match modal
    showNewMatchModal(currentPotentialMatch);
}

// Show new match modal
function showNewMatchModal(match) {
    const modal = document.getElementById('newMatchModal');
    const matchCard = document.getElementById('newMatchCard');
    
    matchCard.innerHTML = `
        <img src="${match.photo}" alt="${match.name}">
        <h3>${match.name}, ${match.age}</h3>
        <p>${match.bio}</p>
        <div class="interests">
            ${match.interests.map(interest => `<span class="interest-tag">#${interest}</span>`).join(' ')}
        </div>
    `;
    
    modal.style.display = 'block';
}

// Accept match
function acceptMatch() {
    if (!currentPotentialMatch) return;
    
    // Add to profiles with initial message
    const newProfile = {
        ...currentPotentialMatch,
        online: Math.random() > 0.5,
        lastSeen: Math.random() > 0.5 ? 'Online ora' : 'Visto poco fa',
        messages: [
            {
                text: `Ciao! Siamo in match! 😊 Come va?`,
                time: getCurrentTime(),
                sent: false
            }
        ]
    };
    
    profiles.unshift(newProfile);
    
    // Remove from potential matches
    const index = potentialMatches.findIndex(p => p.id === currentPotentialMatch.id);
    if (index > -1) {
        potentialMatches.splice(index, 1);
    }
    
    // Update matches list
    loadMatches();
    
    // Show heart animation
    showHeartAnimation();
    
    // Close modal
    closeNewMatchModal();
    
    // Auto-open the new chat
    setTimeout(() => {
        openChat(newProfile.id);
    }, 500);
    
    currentPotentialMatch = null;
}

// Reject match
function rejectMatch() {
    if (!currentPotentialMatch) return;
    
    // Remove from potential matches
    const index = potentialMatches.findIndex(p => p.id === currentPotentialMatch.id);
    if (index > -1) {
        potentialMatches.splice(index, 1);
    }
    
    closeNewMatchModal();
    currentPotentialMatch = null;
}

// Show heart animation
function showHeartAnimation() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-animation';
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = Math.random() * window.innerHeight + 'px';
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                document.body.removeChild(heart);
            }, 2000);
        }, i * 200);
    }
}

// Close new match modal
function closeNewMatchModal() {
    document.getElementById('newMatchModal').style.display = 'none';
    currentPotentialMatch = null;
}

// Show profile modal
function showProfile() {
    if (!currentChatId) return;
    
    const profile = profiles.find(p => p.id === currentChatId);
    if (!profile) return;
    
    const modal = document.getElementById('profileModal');
    const content = document.getElementById('profileModalContent');
    
    content.innerHTML = `
        <img src="${profile.photo}" alt="${profile.name}">
        <h2>${profile.name}, ${profile.age}</h2>
        <p>${profile.bio}</p>
        <div class="profile-stats">
            <div class="stat">
                <div class="stat-number">${profile.messages.length}</div>
                <div class="stat-label">Messaggi</div>
            </div>
            <div class="stat">
                <div class="stat-number">${profile.interests.length}</div>
                <div class="stat-label">Interessi</div>
            </div>
            <div class="stat">
                <div class="stat-number">98%</div>
                <div class="stat-label">Compatibilità</div>
            </div>
        </div>
        <div class="interests">
            <h4>Interessi:</h4>
            ${profile.interests.map(interest => `<span class="interest-tag">#${interest}</span>`).join(' ')}
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close profile modal
function closeModal() {
    document.getElementById('profileModal').style.display = 'none';
}

// Toggle emoji picker
function toggleEmojiPicker() {
    const emojiPicker = document.getElementById('emojiPicker');
    emojiPicker.style.display = emojiPicker.style.display === 'block' ? 'none' : 'block';
}

// Add emoji to message input
function addEmoji(emoji) {
    const messageInput = document.getElementById('messageInput');
    messageInput.value += emoji;
    messageInput.focus();
    document.getElementById('emojiPicker').style.display = 'none';
}

// Attach file (placeholder)
function attachFile() {
    alert('Funzionalità di allegati in arrivo! 📎');
}

// Video call (placeholder)
function videoCall() {
    if (!currentChatId) return;
    const profile = profiles.find(p => p.id === currentChatId);
    alert(`Chiamata video con ${profile.name} in arrivo! 📹`);
}

// Phone call (placeholder)
function phoneCall() {
    if (!currentChatId) return;
    const profile = profiles.find(p => p.id === currentChatId);
    alert(`Chiamata telefonica con ${profile.name} in arrivo! 📞`);
}

// Add some CSS for interest tags
const style = document.createElement('style');
style.textContent = `
    .interest-tag {
        display: inline-block;
        background: linear-gradient(135deg, #e91e63, #f06292);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        margin: 2px;
        font-weight: 500;
    }
    
    .interests {
        margin: 15px 0;
    }
    
    .interests h4 {
        margin-bottom: 10px;
        color: #333;
    }
    
    .online-status.offline::before {
        background: #6c757d !important;
    }
`;
document.head.appendChild(style);

// Auto-update online status
setInterval(() => {
    profiles.forEach(profile => {
        // Randomly change online status
        if (Math.random() < 0.1) {
            profile.online = !profile.online;
            profile.lastSeen = profile.online ? 'Online ora' : `Visto ${Math.floor(Math.random() * 60)} minuti fa`;
        }
    });
    
    // Update current chat header if needed
    if (currentChatId) {
        const profile = profiles.find(p => p.id === currentChatId);
        if (profile) {
            updateChatHeader(profile);
        }
    }
}, 30000); // Update every 30 seconds