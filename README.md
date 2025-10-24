# 🛹 SkateShop Pro - E-commerce Skateboard Completo

Un sito e-commerce completo per skateboard con frontend moderno e backend robusto, sviluppato con tecnologie web moderne.

## 🚀 Caratteristiche Principali

### Frontend
- **Design Moderno**: UI cyberpunk con gradienti neon e animazioni fluide
- **Responsive**: Completamente ottimizzato per desktop, tablet e mobile
- **Navigazione Intuitiva**: Menu di navigazione con sezioni organizzate
- **Catalogo Prodotti**: Griglia di prodotti con filtri e ricerca
- **Carrello Avanzato**: Gestione carrello con aggiornamenti in tempo reale
- **Autenticazione**: Sistema di login/registrazione integrato
- **Checkout**: Processo di checkout completo con form di spedizione

### Backend
- **API RESTful**: Endpoints completi per tutte le funzionalità
- **Autenticazione JWT**: Sistema sicuro con token di accesso
- **Gestione Prodotti**: CRUD completo per prodotti
- **Sistema Carrello**: Gestione carrello per utenti autenticati
- **Gestione Ordini**: Sistema completo di ordini con stati
- **Panel Admin**: Interfaccia amministrativa per gestire il negozio

### Pannello Amministrativo
- **Dashboard**: Statistiche e metriche del negozio
- **Gestione Prodotti**: Aggiungi, modifica, elimina prodotti
- **Gestione Ordini**: Visualizza e aggiorna stati degli ordini
- **Gestione Utenti**: Visualizza informazioni utenti registrati

## 🛠️ Tecnologie Utilizzate

### Frontend
- HTML5 semantico
- CSS3 con Flexbox/Grid
- JavaScript ES6+ vanilla
- Font Awesome per le icone
- Design responsive mobile-first

### Backend
- Node.js
- Express.js
- JWT per autenticazione
- bcryptjs per hash password
- CORS per richieste cross-origin
- Multer per upload file

## 📦 Installazione e Avvio

### Prerequisiti
- Node.js (versione 14 o superiore)
- npm o yarn

### Installazione
```bash
# Clona il repository
git clone <repository-url>
cd skateboard-ecommerce

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Oppure avvia in produzione
npm start
```

### Avvio del Frontend
```bash
# In un terminale separato, avvia il server frontend
npm run client
```

## 🌐 URL e Accessi

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Panel Admin**: http://localhost:3000/admin.html

### Account Demo
- **Admin**: admin@skateshop.com / admin123
- **Utente**: user@example.com / user123

## 📋 API Endpoints

### Autenticazione
- `POST /api/auth/register` - Registrazione utente
- `POST /api/auth/login` - Login utente

### Prodotti
- `GET /api/products` - Lista prodotti (con filtri)
- `GET /api/products/:id` - Dettagli prodotto

### Carrello (Autenticazione richiesta)
- `GET /api/cart` - Visualizza carrello
- `POST /api/cart/add` - Aggiungi al carrello
- `PUT /api/cart/update/:itemId` - Aggiorna quantità
- `DELETE /api/cart/remove/:itemId` - Rimuovi dal carrello

### Ordini (Autenticazione richiesta)
- `POST /api/orders` - Crea ordine
- `GET /api/orders` - Lista ordini utente
- `GET /api/orders/:id` - Dettagli ordine

### Admin (Solo amministratori)
- `GET /api/admin/orders` - Tutti gli ordini
- `PUT /api/admin/orders/:id/status` - Aggiorna stato ordine
- `POST /api/admin/products` - Crea prodotto
- `PUT /api/admin/products/:id` - Aggiorna prodotto
- `DELETE /api/admin/products/:id` - Elimina prodotto

## 🎨 Design e UX

### Palette Colori
- **Primario**: Neon Cyan (#00ffff)
- **Secondario**: Hot Pink (#ff0066)
- **Sfondo**: Dark Gray (#0f0f0f, #1a1a1a)
- **Testo**: White (#fff), Light Gray (#ccc)

### Tipografia
- **Principale**: Inter, system fonts
- **Monospace**: Courier New (per elementi tech)

### Animazioni
- Transizioni fluide (0.3s ease)
- Hover effects con transform e box-shadow
- Loading spinners e feedback visivi
- Animazioni di ingresso per contenuti dinamici

## 📱 Responsive Design

- **Desktop**: Layout a griglia completo
- **Tablet**: Layout adattivo con menu collassabile
- **Mobile**: Stack verticale, menu hamburger, carrello full-screen

## 🔒 Sicurezza

- Hash delle password con bcrypt
- Token JWT con scadenza
- Validazione input lato server
- Protezione routes admin
- CORS configurato correttamente

## 🚀 Funzionalità Avanzate

### Filtri e Ricerca
- Filtro per categoria
- Filtro per brand
- Ordinamento (prezzo, rating, data)
- Ricerca testuale

### Gestione Stock
- Controllo disponibilità
- Indicatori stock basso
- Aggiornamento automatico dopo ordini

### Sistema Notifiche
- Feedback visivo per azioni utente
- Notifiche di successo/errore
- Auto-dismiss dopo 5 secondi

### Carrello Avanzato
- Persistenza per utenti loggati
- Aggiornamento quantità in tempo reale
- Calcolo totale dinamico
- Rimozione prodotti

## 📊 Metriche Dashboard Admin

- Totale prodotti
- Totale ordini
- Numero utenti registrati
- Fatturato totale
- Ordini in attesa
- Prodotti con stock basso

## 🔄 Stati Ordini

- **Pending**: In attesa di elaborazione
- **Processing**: In elaborazione
- **Shipped**: Spedito
- **Delivered**: Consegnato
- **Cancelled**: Annullato

## 🎯 Prossimi Sviluppi

- Integrazione pagamenti reali (Stripe/PayPal)
- Sistema recensioni prodotti
- Wishlist utenti
- Newsletter e email marketing
- Analytics avanzati
- Chat supporto clienti
- Sistema coupon e sconti
- Multi-lingua
- PWA (Progressive Web App)

## 🤝 Contributi

Il progetto è aperto a contributi! Per contribuire:

1. Fork del repository
2. Crea un branch per la feature
3. Commit delle modifiche
4. Push al branch
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file LICENSE per dettagli.

## 🆘 Supporto

Per supporto o domande:
- Apri una issue su GitHub
- Contatta il team di sviluppo
- Consulta la documentazione API

---

**SkateShop Pro** - Il tuo negozio di skateboard online completo! 🛹✨