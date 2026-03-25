# 💬 Messeger — Real-Time Chat Application

A full-stack real-time chat application built with the **MERN Stack** and **Socket.io**, featuring instant messaging, media sharing, voice recording, and more.

---

## 📸 Features

- 🔐 **Authentication** — Signup, Login, Logout with JWT & Cookies
- 💬 **Real-time Messaging** — Instant messaging powered by Socket.io
- 🖼️ **Media Sharing** — Send images, videos, audio recordings & files
- 🎤 **Voice Messages** — Record and send voice notes
- ⌨️ **Typing Indicator** — See when someone is typing in real time
- 🟢 **Online Status** — See who is online/offline
- 🗑️ **Delete Messages** — Delete your own messages
- 🔔 **Unread Badges** — Unread message count per user in sidebar
- 👤 **Profile Management** — Update profile picture via Cloudinary
- 🎨 **Theme Switcher** — 31 DaisyUI themes to choose from
- 🔍 **Search Users** — Search users in the sidebar
- 📱 **Responsive Design** — Works on desktop and mobile

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM for MongoDB |
| Socket.io | Real-time communication |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| Cloudinary | Media file storage |
| cookie-parser | Cookie management |
| cors | Cross-origin resource sharing |
| dotenv | Environment variables |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React.js | UI library |
| Vite | Build tool |
| Tailwind CSS | Styling |
| DaisyUI | UI component library |
| Zustand | State management |
| Axios | HTTP client |
| Socket.io Client | Real-time communication |
| React Router DOM | Client-side routing |
| Lucide React | Icons |
| React Hot Toast | Toast notifications |

---

## 📁 Folder Structure

```
CHATAPP/
│
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js       # Signup, Login, Logout, CheckAuth, UpdateProfile
│   │   └── message.controller.js   # Send, Get, Delete messages, Typing indicator
│   │
│   ├── lib/
│   │   ├── cloudinary.js           # Cloudinary configuration
│   │   ├── db.js                   # MongoDB connection
│   │   ├── socket.js               # Socket.io setup & online users tracking
│   │   └── utils.js                # JWT token generation & cookie setter
│   │
│   ├── middleware/
│   │   └── auth.middleware.js      # protectRoute — JWT verification
│   │
│   ├── models/
│   │   ├── user.model.js           # User schema (fullname, email, password, profilePic)
│   │   └── message.model.js        # Message schema (text, image, audio, video, file, replyTo)
│   │
│   ├── routes/
│   │   ├── auth.route.js           # /api/auth/* routes
│   │   └── message.route.js        # /api/messages/* routes
│   │
│   ├── .env                        # Environment variables (never commit this!)
│   ├── index.js                    # Entry point
│   └── package.json
│
├── frontend/chat-app/
│   ├── dist/                        # Production build output (auto-generated)
│   ├── public/
│   │   └── avatar.png              # Default avatar image
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Top navigation bar
│   │   │   ├── Sidebar.jsx          # Users list with search & online filter
│   │   │   ├── ChatContainer.jsx    # Chat window with all media options
│   │   │   ├── NoChatSelected.jsx   # Empty state when no chat is open
│   │   │   └── AuthImagePattern.jsx # Decorative right panel for auth pages
│   │   │
│   │   ├── constants/
│   │   │   └── index.js             # THEMES array for DaisyUI theme switcher
│   │   │
│   │   ├── lib/
│   │   │   └── axios.js             # Axios instance (auto-switches baseURL dev/prod)
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Main chat layout (Sidebar + ChatContainer)
│   │   │   ├── SignUpPage.jsx        # Registration page
│   │   │   ├── SignInPage.jsx        # Login page
│   │   │   ├── ProfilePage.jsx      # Profile picture & account info
│   │   │   └── SettingsPage.jsx     # Theme switcher with live preview
│   │   │
│   │   ├── Store/
│   │   │   ├── useAuthStore.js      # Auth state + Socket.io connection
│   │   │   ├── useChatStore.js      # Messages, users, typing, unread counts
│   │   │   └── useThemeStore.js     # Theme persistence via localStorage
│   │   │
│   │   ├── App.jsx                  # Routes + auth protection + theme apply
│   │   ├── main.jsx                 # React entry point with BrowserRouter
│   │   └── index.css                # Global styles + Tailwind directives
│   │
│   ├── index.html
│   └── package.json
│
├── package.json                     # Root — concurrently scripts for dev/build/start
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
# Server
PORT=3000
NODE_ENV=development        # Change to "production" when deploying

# MongoDB Atlas
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Never commit your `.env` file to GitHub.** Add `backend/.env` to your `.gitignore`.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account
- [Cloudinary](https://cloudinary.com/) account

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/chatapp.git
cd chatapp
```

---

### 2. Setup Environment Variables

Create `backend/.env` and fill in your credentials:

```bash
# Inside backend/ folder, create .env with your values
PORT=3000
NODE_ENV=development
MONGODB_URI=...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLIENT_URL=http://localhost:5173
```

---

### 3. Install All Dependencies

From the **root** `CHATAPP/` folder:

```bash
npm run install-all
```

This installs dependencies for both backend and frontend simultaneously.

---

### 4. Run in Development Mode

```bash
npm run dev
```

Starts both servers using `concurrently`:
- **Backend** → `http://localhost:3000`
- **Frontend** → `http://localhost:5173`

---

### 5. Build for Production

```bash
npm run build
```

Builds the React frontend into `frontend/chat-app/dist/`.

---

### 6. Start in Production

```bash
npm start
```

Starts the backend server which serves the built frontend.

---

## 📜 Root `package.json` Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Install all | `npm run install-all` | Installs backend + frontend dependencies |
| Development | `npm run dev` | Runs both servers concurrently |
| Build | `npm run build` | Installs all + builds frontend |
| Production | `npm start` | Starts backend only |

---

## 🌐 Axios Configuration

The frontend automatically switches the API base URL based on environment:

```js
// frontend/chat-app/src/lib/axios.js
export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"  // ← Development: direct backend URL
    : "/api",                       // ← Production: relative URL (same server)
  withCredentials: true,            // ← Sends cookies with every request
});
```

---

## 🔌 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/signup` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |
| POST | `/logout` | Logout user | ✅ |
| GET | `/check` | Check auth status | ✅ |
| PUT | `/update-profile` | Update profile picture | ✅ |

### Message Routes — `/api/messages`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/users` | Get all users for sidebar | ✅ |
| GET | `/:id` | Get messages with a user | ✅ |
| POST | `/send/:id` | Send a message | ✅ |
| DELETE | `/:id` | Delete a message | ✅ |
| POST | `/typing/:id` | Send typing indicator | ✅ |

---

## 🔄 Real-Time Socket.io Events

### Server → Client

| Event | Data | Description |
|-------|------|-------------|
| `getOnlineUsers` | `[userId, ...]` | Online user IDs list |
| `newMessage` | `message object` | New message to receiver |
| `messageDeleted` | `{ messageId }` | Message deleted notification |
| `typing` | `{ senderId, isTyping }` | Typing status |
| `messagesSeen` | `{ by: userId }` | Messages read notification |

### Client → Server

| Event | Description |
|-------|-------------|
| `connection` | User opens app — added to online map |
| `disconnect` | User closes app — removed from online map |

---

## 📱 Supported Media Types

| Type | Formats | Cloudinary Folder |
|------|---------|------------------|
| Image | JPG, PNG, GIF, WebP | `CHATAPP/images` |
| Video | MP4, WebM | `CHATAPP/videos` |
| Audio | WebM, MP3, OGG | `CHATAPP/audio` |
| File | PDF, DOC, DOCX, TXT, ZIP | `CHATAPP/files` |

---

## 🎨 Themes

31 DaisyUI themes switchable from Settings page. Persisted in `localStorage`.

`light` `dark` `cupcake` `bumblebee` `emerald` `corporate` `synthwave` `retro` `cyberpunk` `valentine` `halloween` `garden` `forest` `aqua` `lofi` `pastel` `fantasy` `wireframe` `black` `luxury` `dracula` `cmyk` `autumn` `business` `acid` `lemonade` `night` `coffee` `winter` `nord` `sunset`

---

## 🔐 Auth Flow

```
User submits form
      ↓
Backend validates → bcrypt hashes password
      ↓
JWT signed with JWT_SECRET → stored in HTTP-only cookie
      ↓
Frontend sends cookie automatically (withCredentials: true)
      ↓
protectRoute middleware verifies JWT on every protected route
      ↓
req.user populated → controller runs
```

---

## ⚡ Messaging Flow

```
User A sends message
      ↓
POST /api/messages/send/:receiverId
      ↓
Saved to MongoDB ✅ (works even if receiver is offline)
      ↓
Receiver online? → emit "newMessage" via Socket.io ⚡
Receiver offline? → loads from DB on next login ✅
```

---

## 🛡️ Security

- Passwords hashed with **bcrypt** (10 salt rounds)
- JWT stored in **HTTP-only cookies** — not accessible via JS
- **CORS** restricted to `CLIENT_URL` only
- All sensitive keys kept in `.env` — never exposed to frontend
- Cloudinary credentials used server-side only

---

## 🧠 State Management (Zustand)

| Store | Manages |
|-------|---------|
| `useAuthStore` | Auth user, login/logout, Socket.io lifecycle, online users |
| `useChatStore` | Messages, users, selected user, typing, unread counts |
| `useThemeStore` | Selected theme — persisted in localStorage |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Soumanka Paul**

- GitHub: https://github.com/Soumanka-Paul
- 

---

## 📄 License

This project is licensed under the **MIT License**.

---

> Built with ❤️ using MERN Stack + Socket.io by Soumanka Paul
