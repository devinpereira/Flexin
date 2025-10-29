# 💪 Flexin

Flexin is a modern, full-stack health & fitness platform that blends AI-driven personal training with social engagement and eCommerce. Built with the **MERN stack + Python**, it features an ML-powered workout planner, a community feed for user interaction, and a fully integrated store.

---

## 🧰 Tech Stack

| Layer     | Tech                       |
|-----------|----------------------------|
| Frontend  | React.js, Tailwind CSS     |
| Backend   | Node.js, Express.js        |
| Database  | MongoDB (Mongoose)         |
| ML Engine | Python (scikit-learn / custom model) |
| Auth      | JWT (Access + Refresh tokens) |

---

## 🧠 Core Features

### 1. 🏋️ AI-Powered Workout Generation
- Personalized weekly schedules
- Based on fitness level, equipment, goals, and schedule
- Health stat tracking & progress history

### 2. 🌐 Social Community Feed
- Share fitness posts, photos, and updates
- Like and comment system
- Real-time updates via WebSockets

### 3. 🛒 Integrated Fitness Store
- Browse and purchase gym products
- Add to cart, checkout, order history
- Admin product management

---

## 🔒 Authentication & Roles

- Secure JWT-based auth
- Roles: **User**, **Trainer**, **Admin**
- Protected API routes based on role permissions

---

## 🗂 Project Structure

```
Flexin/
├── client/           # React frontend
│   ├── pages/
│   ├── components/
│   └── context/
│
├── server/           # Node.js backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── middleware/
│
├── ml-model/         # Python ML model for workout generation
│   ├── model.py
│   └── predict.py
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/PasinduFdo/Flexin.git
cd Flexin
```

### 2. Backend Setup (Express)

```bash
cd server
npm install
touch .env
```

`.env` example:
```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

Start server:
```bash
npm run dev
```

### 3. Frontend Setup (React)

```bash
cd ../client
npm install
npm run dev
```

### 4. ML Engine Setup (Python)

```bash
cd ../ml-model
pip install -r requirements.txt
python predict.py
```

---

## 📈 Future Enhancements

- [ ] Chat with trainers & friends
- [ ] In-app progress visualization (charts, dashboards)
- [ ] Google Fit/Apple Health integration
- [ ] AI nutrition planning

---

## 🧠 Contributing

Contributions are welcome!

1. Fork the repo  
2. Create a feature branch  
3. Commit your changes  
4. Push to your branch  
5. Open a PR 🚀

---

## 📜 License
```
MIT License © Flexin
```
