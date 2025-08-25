# 🕹️ Re-Tac-Toe

**Re-Tac-Toe** is a full-stack, real-time multiplayer Tic-Tac-Toe game with animated avatars and secure matchmaking. Built using **Spring Boot (Java 21)** for the backend and **React 19 + Vite** on the frontend, it leverages **WebSockets** for real-time play and **JWT** for authentication.

🎮 **Play Now:** [Re-Tac-Toe Live on Netlify](https://re-tac-toe.netlify.app) 

---

## 🔧 Tech Stack

### 🧩 Backend
- Java 21 + Spring Boot 3.5
- WebSockets (STOMP over SockJS)
- Spring Security + JWT
- PostgreSQL + JPA
- MapStruct, Lombok

### 🎨 Frontend
- React 19 + Vite
- Axios + React Router DOM
- STOMP.js + SockJS
- Framer Motion, React Confetti
- Formik

---

## 📁 Project Structure

### Backend (Spring Boot)

```

Back-End/
└── re-tac-toe/
├── src/
│   ├── main/java/com/game/re\_tac\_toe/
│   │   ├── config/            # WebSocket, CORS config
│   │   ├── controller/        # Auth & game controllers
│   │   ├── dto/               # Request/response DTOs
│   │   ├── entity/            # JPA entities & enums
│   │   ├── mapper/            # MapStruct interfaces
│   │   ├── repository/        # Spring Data Repos
│   │   ├── security/          # JWT filters, configs
│   │   ├── service/           # Business logic
│   │   ├── util/              # Game utility logic
│   │   └── ReTacToeApplication.java
│   └── resources/
│       └── application.properties
├── pom.xml
├── Dockerfile
├──  .mvnw
├──  mvnw.cmd
└── .gitignore

```

### Frontend (React)

```

Front-End/
└── Re-Tac-Toe/
├── public/
├── src/
│   ├── animation/             # Framer motion animations
│   ├── assets/avatars/        # Avatar images
│   ├── components/            # Reusable React components
│   ├── context/               # Auth context provider
│   ├── helpers/               # Utility functions
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API, auth, socket clients
│   ├── App.jsx / main.jsx
│   └── index.css
├── vite.config.js
├── package.json
├── .gitignore
└── README.md

````

---

## 🚀 Getting Started

### Backend Setup

```bash
cd Back-End/re-tac-toe
./mvnw spring-boot:run
````

Update `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/re_tac_toe
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASS
spring.jpa.hibernate.ddl-auto=update
jwt.secret=YOUR_SECRET_KEY
```

---

### Frontend Setup

```bash
cd Front-End/Re-Tac-Toe
npm install
npm run dev
```

Make sure the frontend is pointing to the correct backend URL (e.g., `http://localhost:8080`).

---

## 📦 Building for Production

### Backend

```bash
./mvnw clean package
```

### Frontend

```bash
npm run build
```

---

## 🐳 Docker Support

Backend Docker image:

```bash
cd Back-End/re-tac-toe
docker build -t re-tac-toe-backend .
docker run -p 8080:8080 re-tac-toe-backend
```

---

## 🤝 Contributing

1. Fork this repo
2. Create a new branch (`feature/my-feature`)
3. Commit your changes
4. Push and open a PR

---

## 👤 Author

**Thilak Adepu** — *Developer and Maintainer*   
Email: thilakadep@gmail.com

---

## 📜 License

This project is licensed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

## 💬 Contact

Found a bug or want to contribute ideas?
Open an [issue on GitHub](https://github.com/thilakadepu/re-tac-toe/issues).

```
