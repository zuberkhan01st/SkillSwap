# 🚀 SkillSwap Backend API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8%2B-blue?style=for-the-badge&logo=typescript)
![Express](https://img.shields.io/badge/Express.js-4.21-yellow?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=for-the-badge&logo=mongodb)

**Complete Backend API for the SkillSwap Platform**

</div>

---

## 🏗️ **Architecture Overview**

This is the backend API for SkillSwap - a comprehensive skill exchange platform built with Node.js, Express, TypeScript, and MongoDB. The API provides complete functionality for user management, skill exchanges, video meeting integration, and admin controls.

### 🎯 **Key Features**
- 🔐 **JWT Authentication** with bcrypt password hashing
- 👤 **User Management** with rich profiles and skills
- 🔄 **Skill Exchange System** with request lifecycle
- 📹 **Jit.si Video Meeting Integration** for real meetings
- ⭐ **Rating & Feedback System** for quality assurance
- 🛡️ **Admin Dashboard** with platform controls
- 📊 **Analytics & Reporting** for insights
- 🌐 **RESTful API Design** with comprehensive endpoints

---

## 🚀 **Quick Start**

### 📋 **Prerequisites**
- **Node.js** 18 or higher
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### 🔧 **Installation**

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

---

## 🌍 **Environment Configuration**

Create a `.env` file in the Backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skillswap

# Authentication
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random

# Email Configuration (Optional)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password

# Brevo Email Service (Alternative)
BREVO_API_KEY=your-brevo-api-key
BREVO_EMAIL_USER=your-verified-sender@domain.com
```

---

## 📁 **Project Structure**

```
Backend/
├── src/
│   ├── app.ts                 # Main application entry
│   ├── config/
│   │   └── db.ts             # Database configuration
│   ├── controllers/
│   │   ├── authController.ts  # Authentication logic
│   │   ├── userController.ts  # User management
│   │   ├── swapController.ts  # Skill exchange logic
│   │   ├── ratingController.ts# Rating system
│   │   └── adminController.ts # Admin functions
│   ├── middleware/
│   │   ├── auth.ts           # JWT authentication
│   │   └── admin.ts          # Admin authorization
│   ├── models/
│   │   ├── User.ts           # User schema
│   │   ├── SwapRequest.ts    # Swap request schema
│   │   ├── Meeting.ts        # Meeting schema
│   │   ├── Rating.ts         # Rating schema
│   │   └── AdminMessage.ts   # Admin message schema
│   ├── routes/
│   │   ├── authRoutes.ts     # Auth endpoints
│   │   ├── userRoutes.ts     # User endpoints
│   │   ├── swapRoutes.ts     # Swap endpoints
│   │   ├── ratingRoutes.ts   # Rating endpoints
│   │   └── adminRoutes.ts    # Admin endpoints
│   └── services/
│       ├── emailService.ts   # Email functionality
│       ├── brevo.ts          # Brevo email service
│       └── meetingService.ts # Jit.si integration
├── uploads/                   # File upload storage
├── dist/                     # Compiled JavaScript
├── .env                      # Environment variables
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and scripts
├── API_DOCUMENTATION.md      # Complete API documentation
├── TESTING_GUIDE.md          # Manual testing guide
└── README.md                 # This file
```

---

## 🛠️ **Tech Stack**

### **Core Technologies**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### **Authentication & Security**
- **JSON Web Tokens (JWT)** - Secure authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting

### **File Handling & Services**
- **Multer** - File upload handling
- **Nodemailer** - Email sending
- **Brevo** - Email service provider
- **Jit.si** - Video meeting integration

### **Development Tools**
- **nodemon** - Development auto-restart
- **ts-node** - TypeScript execution
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 🔌 **API Endpoints Overview**

### 🔐 **Authentication** (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login

### 👤 **User Management** (`/api/user`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `POST /profile/photo` - Upload profile photo
- `GET /search` - Search users by skills
- `GET /skill/:skill` - Get users by skill

### 🔄 **Skill Exchange** (`/api/swap`)
- `POST /request` - Create swap request
- `GET /my-requests` - Get user's requests
- `PUT /:id/accept` - Accept request
- `PUT /:id/reject` - Reject request
- `DELETE /:id` - Cancel request

### 📹 **Video Meetings** (`/api/swap/meetings`)
- `GET /upcoming` - Get upcoming meetings
- `GET /:id` - Get meeting details
- `PUT /:id/status` - Update meeting status

### ⭐ **Ratings** (`/api/rating`)
- `POST /rate` - Rate a user
- `GET /user/:id` - Get user ratings
- `GET /my-given` - Get given ratings
- `GET /my-received` - Get received ratings

### 🛡️ **Admin** (`/api/admin`)
- `GET /users` - Get all users
- `PUT /users/:id/ban` - Ban/unban user
- `POST /messages` - Send platform message
- `GET /statistics` - Platform statistics
- `GET /reports` - Generate reports

---

## 🎯 **Key Features Implementation**

### 🔒 **Security Features**
- **JWT Authentication** with secure token generation
- **Password Hashing** using bcrypt with salt rounds
- **Input Validation** and sanitization
- **Rate Limiting** to prevent abuse
- **CORS Protection** for cross-origin requests
- **Helmet** for security headers

### 📹 **Video Meeting Integration**
- **Jit.si Integration** for real video meetings
- **Automatic Room Generation** with unique IDs
- **Meeting Lifecycle Management** (scheduled → in-progress → completed)
- **IST-Friendly Scheduling** for Indian developers

### 👥 **User Management**
- **Rich User Profiles** with skills, bio, and availability
- **Skill-based Search** and discovery
- **Profile Photo Upload** with file handling
- **Privacy Controls** (public/private profiles)
- **Location-based Filtering** for local connections

### 🔄 **Skill Exchange System**
- **Request Creation** with detailed messages
- **Approval Workflow** (pending → accepted/rejected)
- **Meeting Scheduling** upon acceptance
- **Status Tracking** throughout the lifecycle
- **Completion Marking** after sessions

### ⭐ **Rating System**
- **5-Star Rating Scale** with detailed feedback
- **Mutual Rating** between swap participants
- **Reputation Building** with aggregated scores
- **Rating History** and detailed reviews

### 🛡️ **Admin Dashboard**
- **User Management** with ban/unban capabilities
- **Content Moderation** for inappropriate requests
- **Platform Messaging** for announcements
- **Analytics Dashboard** with key metrics
- **Report Generation** for platform insights

---

## 🧪 **Testing & Development**

### 🔍 **Development Commands**
```bash
# Start development server with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Format code
npm run format
```

### 🌐 **API Testing**
```bash
# Run the included demo script
node ../demo_test.js

# Use Postman/Thunder Client with provided collections
# Import: Backend/postman_collection.json

# Follow manual testing guide
# See: TESTING_GUIDE.md
```

### 📊 **Health Checks**
- **API Health:** `GET /api/health`
- **Database Status:** `GET /api/status`
- **Environment Info:** `GET /api/info`

---

## 🚀 **Deployment**

### 🌐 **Production Build**
```bash
# Install production dependencies
npm ci --only=production

# Build TypeScript
npm run build

# Start production server
npm start
```

### 🔧 **Environment Variables**
Set these in your production environment:
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://your-production-db
JWT_SECRET=your-super-secure-production-secret
```

### 📦 **Docker Support**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 📚 **Documentation**

### 📖 **API Documentation**
Complete API documentation with examples and schemas:
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Full endpoint documentation

### 🧪 **Testing Guide**
Step-by-step testing instructions:
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Manual testing procedures

### 🔗 **External Resources**
- **[Jit.si API Docs](https://jitsi.github.io/handbook/)** - Video meeting integration
- **[MongoDB Docs](https://docs.mongodb.com/)** - Database documentation
- **[Express.js Guide](https://expressjs.com/en/guide/)** - Framework documentation

---

## 🤝 **Contributing**

### 🛠️ **Development Setup**
1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create feature branch: `git checkout -b feature/new-feature`
5. Make changes and test
6. Commit: `git commit -m "Add new feature"`
7. Push: `git push origin feature/new-feature`
8. Create Pull Request

### 📝 **Code Standards**
- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Add JSDoc comments for functions
- Include error handling
- Validate input data

---

## 📞 **Support**

### 💬 **Get Help**
- 📚 **Documentation:** Check API_DOCUMENTATION.md
- 🧪 **Testing:** Follow TESTING_GUIDE.md
- 🐛 **Issues:** Create GitHub issue
- 💡 **Features:** Open feature request

### 🔧 **Common Issues**
- **Build Errors:** Run `npm run build` to check TypeScript errors
- **Database Connection:** Verify MONGO_URI in .env
- **Authentication Issues:** Check JWT_SECRET configuration
- **File Upload Problems:** Ensure uploads/ directory exists

---

<div align="center">

**🚀 Backend API ready for the SkillSwap Platform!**

**Built with ❤️ for seamless skill exchange**

</div>