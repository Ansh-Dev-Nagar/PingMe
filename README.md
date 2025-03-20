# PingMe - Real-time Chat Application

A modern, real-time chat application built with Next.js, Express, MongoDB, and Socket.io.

## Features

- 🔐 User Authentication (Signup/Login)
- 💬 Real-time Messaging
- 👤 User Profiles
- 🔍 User Search
- 📱 Responsive Design
- 🔒 Secure Password Handling
- 🚀 Real-time Online Status

## Tech Stack

- **Frontend**: Next.js, React, Semantic UI
- **Backend**: Express.js, Socket.io
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt
- **Real-time Communication**: Socket.io

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Ansh-Dev-Nagar/PingMe.git
cd PingMe
```

2. Install dependencies:
```bash
npm install
```

3. Create a `config.env` file in the root directory with the following variables:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Environment Variables

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Server port (default: 3000)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Ansh Dev Nagar
- Email: anshdevnagar@gmail.com

## Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database
- Socket.io for real-time communication 