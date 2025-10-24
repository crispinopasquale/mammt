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
        name: "Lucia 'Thrash' Bianchi",
        age: 28,
        photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
        bio: "Punk rock skater dal '92. Colleziono deck femminili vintage e grafiche underground. Viva il DIY!",
        interests: ["Punk Rock", "DIY Graphics", "90s Boards", "Zines"],
        online: false,
        lastSeen: "Visto 2 ore fa",
        collection: "80+ boards punk/indie",
        location: "Roma",
        messages: [
            { text: "Ehi! Ho visto che hai dei deck Suicidal Tendencies rari 🤘", time: "12:15", sent: false },
            { text: "Sì! Sono la mia passione. Tu hai qualche pezzo punk rock?", time: "12:45", sent: true },
            { text: "Ho un Pushead originale del '89, ancora con le ruote originali!", time: "13:20", sent: false }
        ]
    },
    {
        id: 3,
        name: "Tony 'Hawk Eye' Verde",
        age: 42,
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        bio: "Veterano dello skate anni '80. Colleziono principalmente Santa Cruz e Independent. Ho skattato con i pro!",
        interests: ["Santa Cruz", "Independent", "Vert Skating", "Old School"],
        online: true,
        lastSeen: "Online ora",
        collection: "200+ boards classici",
        location: "Torino",
        messages: [
            { text: "Bro! Ho visto la tua Santa Cruz Screaming Hand del '85! 🔥", time: "16:20", sent: false },
            { text: "Quella è la mia reliquia! L'ho comprata nuova nel negozio", time: "16:22", sent: true },
            { text: "Pazzesco! Io ho ancora i truck Independent Stage 1 originali", time: "16:25", sent: false },
            { text: "Dobbiamo organizzare una session old school! 🛹", time: "16:27", sent: true }
        ]
    },
    {
        id: 4,
        name: "Spike 'Ripper' Neri",
        age: 30,
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
        bio: "Hardcore punk skater. Colleziono deck con grafiche controverse e underground. Fuck conformity! ⚡",
        interests: ["Hardcore Punk", "Underground Art", "Rare Graphics", "Zines"],
        online: false,
        lastSeen: "Visto 1 ora fa",
        collection: "90+ boards underground",
        location: "Napoli",
        messages: [
            { text: "Yo! Hai mai visto un Natas Kaupas SMA del '89?", time: "19:30", sent: false },
            { text: "Cazzo sì! È il Santo Graal! Ne ho uno ma è un po' rovinato", time: "19:45", sent: true },
            { text: "Anche rovinato vale una fortuna! Io cerco da anni", time: "19:47", sent: false },
            { text: "Se trovo un doppione ti faccio sapere! 🤝", time: "19:50", sent: true }
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
let currentPotentialCollector = null;
let typingTimeout = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadMatches();
    setupEventListeners();
});

// Load collectors in sidebar
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
            closeNewCollectorModal();
        }
    };

    // Close emoji picker and quick actions when clicking outside
    document.addEventListener('click', function(event) {
        const emojiPicker = document.getElementById('emojiPicker');
        const emojiBtn = document.querySelector('.emoji-btn');
        const quickActions = document.getElementById('quickActions');
        const quickBtn = document.querySelector('.quick-btn');
        
        if (!emojiPicker.contains(event.target) && event.target !== emojiBtn) {
            emojiPicker.style.display = 'none';
        }
        
        if (!quickActions.contains(event.target) && event.target !== quickBtn) {
            quickActions.style.display = 'none';
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
    if (message.image) {
        addImageMessageToChat(message, profile);
        return;
    }
    
    if (message.isTrading) {
        addTradingMessageToChat(message, profile);
        return;
    }
    
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
            "Figo! Mandami qualche foto! 📸",
            "Cazzo che pezzo raro! 🔥",
            "Anch'io ho quella board!",
            "Mai visto niente del genere! 🤯",
            "Quella è una reliquia!",
            "Quanto l'hai pagata? 💰",
            "Dobbiamo fare uno scambio!",
            "La tua collezione è pazzesca! 🛹"
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

// Find new collector
function findNewCollector() {
    if (potentialCollectors.length === 0) {
        alert('Non ci sono nuovi collezionisti disponibili al momento. Riprova più tardi!');
        return;
    }
    
    // Get random potential collector
    const randomIndex = Math.floor(Math.random() * potentialCollectors.length);
    currentPotentialCollector = potentialCollectors[randomIndex];
    
    // Show new collector modal
    showNewCollectorModal(currentPotentialCollector);
}

// Show new collector modal
function showNewCollectorModal(collector) {
    const modal = document.getElementById('newMatchModal');
    const matchCard = document.getElementById('newMatchCard');
    
    matchCard.innerHTML = `
        <img src="${collector.photo}" alt="${collector.name}">
        <h3>${collector.name}, ${collector.age}</h3>
        <p>${collector.bio}</p>
        <div class="collector-info">
            <span class="collection-tag">📍 ${collector.location}</span>
            <span class="collection-tag">🛹 ${collector.collection}</span>
        </div>
        <div class="interests">
            ${collector.interests.map(interest => `<span class="interest-tag">#${interest}</span>`).join(' ')}
        </div>
    `;
    
    modal.style.display = 'block';
}

// Connect with collector
function connectCollector() {
    if (!currentPotentialCollector) return;
    
    // Add to profiles with initial message
    const newProfile = {
        ...currentPotentialCollector,
        online: Math.random() > 0.5,
        lastSeen: Math.random() > 0.5 ? 'Online ora' : 'Visto poco fa',
        messages: [
            {
                text: `Yo! Siamo connessi! 🤘 Che boards hai da mostrare?`,
                time: getCurrentTime(),
                sent: false
            }
        ]
    };
    
    profiles.unshift(newProfile);
    
    // Remove from potential collectors
    const index = potentialCollectors.findIndex(p => p.id === currentPotentialCollector.id);
    if (index > -1) {
        potentialCollectors.splice(index, 1);
    }
    
    // Update collectors list
    loadMatches();
    
    // Show skate animation
    showSkateAnimation();
    
    // Close modal
    closeNewCollectorModal();
    
    // Auto-open the new chat
    setTimeout(() => {
        openChat(newProfile.id);
    }, 500);
    
    currentPotentialCollector = null;
}

// Reject collector
function rejectCollector() {
    if (!currentPotentialCollector) return;
    
    // Remove from potential collectors
    const index = potentialCollectors.findIndex(p => p.id === currentPotentialCollector.id);
    if (index > -1) {
        potentialCollectors.splice(index, 1);
    }
    
    closeNewCollectorModal();
    currentPotentialCollector = null;
}

// Show skate animation
function showSkateAnimation() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const skate = document.createElement('div');
            skate.className = 'skate-animation';
            skate.innerHTML = '🛹';
            skate.style.left = Math.random() * window.innerWidth + 'px';
            skate.style.top = Math.random() * window.innerHeight + 'px';
            
            document.body.appendChild(skate);
            
            setTimeout(() => {
                document.body.removeChild(skate);
            }, 2000);
        }, i * 200);
    }
}

// Close new collector modal
function closeNewCollectorModal() {
    document.getElementById('newMatchModal').style.display = 'none';
    currentPotentialCollector = null;
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
        <div class="collector-info">
            <span class="collection-tag">📍 ${profile.location}</span>
            <span class="collection-tag">🛹 ${profile.collection}</span>
        </div>
        <div class="profile-stats">
            <div class="stat">
                <div class="stat-number">${profile.messages.length}</div>
                <div class="stat-label">Messaggi</div>
            </div>
            <div class="stat">
                <div class="stat-number">${profile.interests.length}</div>
                <div class="stat-label">Brands</div>
            </div>
            <div class="stat">
                <div class="stat-number">${Math.floor(Math.random() * 20) + 80}%</div>
                <div class="stat-label">Skate Level</div>
            </div>
        </div>
        <div class="interests">
            <h4>Brands Preferiti:</h4>
            ${profile.interests.map(interest => `<span class="interest-tag">#${interest}</span>`).join(' ')}
        </div>
        <div class="trading-section">
            <h4>Trading Status:</h4>
            <div class="trading-status">
                <span class="status-tag active">🔄 Disponibile per scambi</span>
                <span class="status-tag">💰 Compro/Vendo</span>
            </div>
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

// Toggle quick actions
function toggleQuickActions() {
    const quickActions = document.getElementById('quickActions');
    quickActions.style.display = quickActions.style.display === 'block' ? 'none' : 'block';
}

// Send quick message
function sendQuickMessage(text) {
    const messageInput = document.getElementById('messageInput');
    messageInput.value = text;
    sendMessage();
    document.getElementById('quickActions').style.display = 'none';
}

// Share skateboard photo
function shareBoard() {
    if (!currentChatId) return;
    const profile = profiles.find(p => p.id === currentChatId);
    
    // Simulate image sharing
    const newMessage = {
        text: "📷 [Foto condivisa: Powell Peralta Tony Hawk '85]",
        time: getCurrentTime(),
        sent: true
    };
    
    profile.messages.push(newMessage);
    addMessageToChat(newMessage, profile);
    loadMatches();
    
    // Simulate response
    setTimeout(() => {
        const response = {
            text: "Madonna che pezzo! 🔥 Condizione mint?",
            time: getCurrentTime(),
            sent: false
        };
        profile.messages.push(response);
        addMessageToChat(response, profile);
        loadMatches();
    }, 1500);
}

// Trading post
function tradingPost() {
    if (!currentChatId) return;
    const profile = profiles.find(p => p.id === currentChatId);
    
    // Create trading message
    const tradingMessage = {
        text: "🔄 [Proposta di Trading Aperta]\n\n💰 Cosa offri?\n🛹 Cosa cerchi?\n📍 Dove ci troviamo?\n\nScriviamo i dettagli qui sotto! 🤝",
        time: getCurrentTime(),
        sent: true,
        isTrading: true
    };
    
    profile.messages.push(tradingMessage);
    addTradingMessageToChat(tradingMessage, profile);
    loadMatches();
    
    // Simulate response
    setTimeout(() => {
        const response = {
            text: "Perfetto! Io ho un Powell Peralta del '86 in ottime condizioni. Tu cosa hai da offrire? 🛹",
            time: getCurrentTime(),
            sent: false
        };
        
        profile.messages.push(response);
        addMessageToChat(response, profile);
        loadMatches();
    }, 2000);
}

// Add trading message to chat
function addTradingMessageToChat(message, profile) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sent ? 'sent' : 'received'} trading-message`;
    
    messageDiv.innerHTML = `
        ${!message.sent ? `<img src="${profile.photo}" alt="${profile.name}" class="message-avatar">` : ''}
        <div class="message-bubble trading-bubble">
            <div class="trading-header">
                <i class="fas fa-exchange-alt"></i>
                <span>TRADING POST</span>
            </div>
            <div class="trading-content">
                ${message.text.replace(/\n/g, '<br>')}
            </div>
            <div class="message-time">${message.time}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file || !currentChatId) return;
    
    const profile = profiles.find(p => p.id === currentChatId);
    if (!profile) return;
    
    // Create a URL for the uploaded image
    const imageUrl = URL.createObjectURL(file);
    
    // Create image message
    const imageMessage = {
        text: `📷 [Foto condivisa: ${file.name}]`,
        time: getCurrentTime(),
        sent: true,
        image: imageUrl
    };
    
    profile.messages.push(imageMessage);
    addImageMessageToChat(imageMessage, profile);
    loadMatches();
    
    // Simulate response
    setTimeout(() => {
        const responses = [
            "Wow! Che board fantastica! 🔥",
            "Madonna che pezzo raro! 😍",
            "Condizione perfetta! Quanto l'hai pagata?",
            "Quella grafica è pazzesca! 🤘",
            "Hai una collezione incredibile!",
            "Voglio quella board! Facciamo uno scambio?"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const response = {
            text: randomResponse,
            time: getCurrentTime(),
            sent: false
        };
        
        profile.messages.push(response);
        addMessageToChat(response, profile);
        loadMatches();
    }, 2000);
    
    // Clear the input
    event.target.value = '';
}

// Add image message to chat
function addImageMessageToChat(message, profile) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sent ? 'sent' : 'received'}`;
    
    messageDiv.innerHTML = `
        ${!message.sent ? `<img src="${profile.photo}" alt="${profile.name}" class="message-avatar">` : ''}
        <div class="message-bubble image-message">
            <img src="${message.image}" alt="Shared skateboard" class="shared-image" onclick="openImageModal('${message.image}')">
            <div class="image-caption">${message.text}</div>
            <div class="message-time">${message.time}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Open image in modal
function openImageModal(imageUrl) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.onclick = () => document.body.removeChild(modal);
    
    modal.innerHTML = `
        <div class="image-modal-content">
            <img src="${imageUrl}" alt="Skateboard photo">
            <span class="close-image" onclick="document.body.removeChild(this.parentElement.parentElement)">&times;</span>
        </div>
    `;
    
    document.body.appendChild(modal);
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