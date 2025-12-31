# DocQA - Document Question Answering System

A full-stack RAG (Retrieval-Augmented Generation) application that enables users to upload PDF documents and ask questions about their content using advanced LLM models. Built with a **Modular Monolithic** architecture following **Hexagonal Architecture** principles.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [LLM Models Used](#llm-models-used)
- [System Flow](#system-flow)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Features](#features)

## 🎯 Overview

DocQA is a document question-answering system that combines:
- **PDF Document Processing**: Extract and parse text from PDF files
- **Vector Embeddings**: Convert documents into high-dimensional vectors using Jina AI embeddings
- **Semantic Search**: Find relevant document chunks using cosine similarity
- **LLM-Powered Answers**: Generate contextual answers using Groq's Llama 3.1 model
- **User Authentication**: Secure JWT-based authentication system
- **Chat History**: Persistent chat history with last 5 conversations

## 🏗️ Architecture

### Modular Monolithic + Hexagonal Architecture

This project follows a **Modular Monolithic** structure with **Hexagonal Architecture** (Ports & Adapters) principles:

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                       │
│  (Controllers, Routes, Middlewares)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    Application Layer                          │
│  (Services - Business Logic)                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    Domain Layer                                │
│  (Repositories - Data Access)                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    Infrastructure Layer                       │
│  (Database, External APIs, File System)                       │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Modular Monolithic**: Code organized into feature modules (user, document, query)
2. **Hexagonal Architecture**: Clear separation between business logic and infrastructure
3. **Dependency Inversion**: High-level modules don't depend on low-level modules
4. **Single Responsibility**: Each module handles one domain concern

### Module Structure

Each module follows this structure:
```
modules/
  ├── {module-name}/
  │   ├── {module-name}.controller.ts  # Presentation Layer
  │   ├── {module-name}.service.ts     # Application Layer
  │   ├── {module-name}.repository.ts   # Domain Layer
  │   ├── {module-name}.routes.ts       # Route definitions
  │   └── {module-name}.types.ts        # Type definitions
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **PDF Parsing**: pdf-parse
- **Validation**: Zod

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API

### External Services
- **Embeddings**: Jina AI (jina-embeddings-v2-base-en)
- **LLM**: Groq API (llama-3.1-8b-instant)

## 🤖 LLM Models Used

### 1. Jina Embeddings v2 Base EN
- **Provider**: Jina AI
- **Model**: `jina-embeddings-v2-base-en`
- **Purpose**: Generate vector embeddings for documents and queries
- **Embedding Dimension**: 768
- **Use Cases**:
  - Document embedding during upload
  - Query embedding for semantic search

**API Endpoint**: `https://api.jina.ai/v1/embeddings`

### 2. Llama 3.1 8B Instant
- **Provider**: Groq
- **Model**: `llama-3.1-8b-instant`
- **Purpose**: Generate contextual answers based on retrieved documents
- **Temperature**: 0.2 (for consistent, focused responses)
- **Use Cases**:
  - Answer generation from retrieved context
  - Context-aware question answering

**API Endpoint**: `https://api.groq.com/openai/v1/chat/completions`

## 🔄 System Flow

### Document Upload Flow

```
┌─────────────┐
│   Client    │
│  (React)    │
└──────┬──────┘
       │
       │ 1. POST /api/documents/upload (PDF file)
       ▼
┌─────────────────────────────────────┐
│     Document Controller              │
│  (Presentation Layer)                │
└──────┬───────────────────────────────┘
       │
       │ 2. Parse PDF → Extract Text
       ▼
┌─────────────────────────────────────┐
│     Document Service                 │
│  (Application Layer)                 │
└──────┬───────────────────────────────┘
       │
       │ 3. Generate Embeddings
       ▼
┌─────────────────────────────────────┐
│     Jina AI API                      │
│  (jina-embeddings-v2-base-en)       │
└──────┬───────────────────────────────┘
       │
       │ 4. Return Embedding Vector (768 dim)
       ▼
┌─────────────────────────────────────┐
│     Document Repository              │
│  (Domain Layer)                      │
└──────┬───────────────────────────────┘
       │
       │ 5. Save to Database
       ▼
┌─────────────────────────────────────┐
│     PostgreSQL + Prisma              │
│  (Infrastructure Layer)              │
└──────────────────────────────────────┘
```

### Query Processing Flow (RAG Pipeline)

```
┌─────────────┐
│   Client    │
│  (React)    │
└──────┬──────┘
       │
       │ 1. POST /api/query { question: "..." }
       ▼
┌─────────────────────────────────────┐
│     Query Controller                 │
│  (Presentation Layer)                │
└──────┬───────────────────────────────┘
       │
       │ 2. Validate & Process
       ▼
┌─────────────────────────────────────┐
│     Query Service                    │
│  (Application Layer)                 │
└──────┬───────────────────────────────┘
       │
       │ 3. Generate Query Embedding
       ▼
┌─────────────────────────────────────┐
│     Jina AI API                      │
│  (jina-embeddings-v2-base-en)       │
└──────┬───────────────────────────────┘
       │
       │ 4. Query Embedding Vector
       ▼
┌─────────────────────────────────────┐
│     Query Repository                 │
│  (Domain Layer)                      │
└──────┬───────────────────────────────┘
       │
       │ 5. Fetch All Documents
       ▼
┌─────────────────────────────────────┐
│     PostgreSQL                       │
│  (Infrastructure Layer)              │
└──────┬───────────────────────────────┘
       │
       │ 6. Calculate Cosine Similarity
       ▼
┌─────────────────────────────────────┐
│     Cosine Similarity Algorithm      │
│  (Shared Utility)                    │
└──────┬───────────────────────────────┘
       │
       │ 7. Rank & Select Top 3 Docs
       ▼
┌─────────────────────────────────────┐
│     Context Retrieval                │
│  (Top 3 Relevant Chunks)            │
└──────┬───────────────────────────────┘
       │
       │ 8. Build Prompt with Context
       ▼
┌─────────────────────────────────────┐
│     Groq API                         │
│  (llama-3.1-8b-instant)             │
└──────┬───────────────────────────────┘
       │
       │ 9. Generate Answer
       ▼
┌─────────────────────────────────────┐
│     Return Answer + Sources          │
│  { answer, sources: [...] }          │
└──────┬───────────────────────────────┘
       │
       │ 10. Display in Chat UI
       ▼
┌─────────────┐
│   Client    │
│  (React)    │
└─────────────┘
```

### Authentication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. POST /api/auth/register or /login
       ▼
┌─────────────────────────────────────┐
│     User Controller                  │
└──────┬───────────────────────────────┘
       │
       │ 2. Validate & Process
       ▼
┌─────────────────────────────────────┐
│     User Service                     │
│  - Hash Password (bcrypt)            │
│  - Generate JWT Token                │
└──────┬───────────────────────────────┘
       │
       │ 3. Save User / Verify Credentials
       ▼
┌─────────────────────────────────────┐
│     User Repository                  │
│  (Prisma + PostgreSQL)              │
└──────┬───────────────────────────────┘
       │
       │ 4. Return JWT Token
       ▼
┌─────────────┐
│   Client    │
│  (Stores token in localStorage)      │
└─────────────┘
```

## 📁 Project Structure

```
DocQA/
├── client/                          # Frontend Application
│   ├── src/
│   │   ├── api/                     # API Client Layer
│   │   │   ├── auth.api.ts
│   │   │   ├── document.api.ts
│   │   │   ├── query.api.ts
│   │   │   └── client.ts            # Base API client with auth
│   │   ├── app/                     # App Configuration
│   │   │   ├── App.tsx
│   │   │   ├── routes.tsx
│   │   │   └── providers.tsx
│   │   ├── modules/                 # Feature Modules
│   │   │   ├── auth/                # Authentication Module
│   │   │   │   ├── auth.hooks.tsx
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   ├── document/            # Document Upload Module
│   │   │   │   ├── UploadPage.tsx
│   │   │   │   └── document.hooks.ts
│   │   │   └── chat/                # Chat Module
│   │   │       ├── ChatPage.tsx
│   │   │       ├── ChatInput.tsx
│   │   │       ├── ChatMessages.tsx
│   │   │       ├── chat.hooks.ts
│   │   │       └── chatHistory.ts   # Chat history management
│   │   ├── shared/                  # Shared Components & Utils
│   │   │   ├── components/
│   │   │   └── utils/
│   │   └── config/
│   └── package.json
│
└── server/                          # Backend Application
    ├── src/
    │   ├── modules/                 # Feature Modules (Hexagonal)
    │   │   ├── user/                # User Module
    │   │   │   ├── user.controller.ts    # Presentation
    │   │   │   ├── user.service.ts       # Application
    │   │   │   ├── user.repository.ts    # Domain
    │   │   │   ├── user.routes.ts
    │   │   │   └── user.types.ts
    │   │   ├── document/            # Document Module
    │   │   │   ├── document.controller.ts
    │   │   │   ├── document.service.ts
    │   │   │   ├── document.repository.ts
    │   │   │   ├── document.routes.ts
    │   │   │   └── document.types.ts
    │   │   └── query/               # Query Module
    │   │       ├── query.controller.ts
    │   │       ├── query.service.ts
    │   │       ├── query.repository.ts
    │   │       ├── query.routes.ts
    │   │       └── query.types.ts
    │   ├── shared/                  # Shared Infrastructure
    │   │   ├── middlewares/
    │   │   │   ├── auth.middleware.ts
    │   │   │   ├── error.middleware.ts
    │   │   │   └── upload.middleware.ts
    │   │   ├── utils/
    │   │   │   ├── cosineSimilarity.ts
    │   │   │   └── jwt.ts
    │   │   └── errors/
    │   │       └── ApiError.ts
    │   ├── db/                      # Database Layer
    │   │   └── prisma.ts
    │   ├── config/
    │   │   └── env.ts
    │   ├── routes.ts                # Route Aggregation
    │   ├── app.ts                   # Express App Setup
    │   └── server.ts                # Server Entry Point
    ├── prisma/
    │   ├── schema.prisma            # Database Schema
    │   └── migrations/
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Jina AI API key
- Groq API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd DocQA
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../client
npm install
```

4. **Setup Database**
```bash
cd ../server
# Create .env file with database URL
npx prisma migrate dev
npx prisma generate
```

5. **Configure Environment Variables**

Create `server/.env`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/docqa"

# JWT
JWT_SECRET="your-secret-key"

# External APIs
JINA_API_KEY="your-jina-api-key"
GROQ_API_KEY="your-groq-api-key"

# Server
PORT=3000
```

Create `client/src/config/env.ts`:
```typescript
export const API_BASE_URL = "http://localhost:3000/api";
```

6. **Run the Application**

Backend:
```bash
cd server
npm run dev
```

Frontend (in a new terminal):
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here"
}
```

### Document Endpoints

#### Upload PDF
```http
POST /api/documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <PDF file>
```

**Response:**
```json
{
  "message": "PDF uploaded & indexed",
  "documentId": "uuid-here"
}
```

### Query Endpoints

#### Ask Question
```http
POST /api/query
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "What is the main topic of the document?"
}
```

**Response:**
```json
{
  "answer": "The document discusses...",
  "sources": [
    {
      "id": "doc-id",
      "content": "relevant text chunk",
      "score": 0.85
    }
  ]
}
```

## ✨ Features

### Backend Features
- ✅ JWT-based authentication
- ✅ PDF text extraction
- ✅ Vector embeddings generation (Jina AI)
- ✅ Semantic search with cosine similarity
- ✅ RAG pipeline with Groq LLM
- ✅ PostgreSQL database with Prisma ORM
- ✅ Modular architecture with clear separation of concerns
- ✅ Error handling and validation

### Frontend Features
- ✅ Modern React UI with Tailwind CSS
- ✅ User authentication (Login/Register)
- ✅ PDF document upload
- ✅ Interactive chat interface
- ✅ Chat history (last 5 conversations)
- ✅ Real-time question answering
- ✅ Responsive design
- ✅ Token persistence in localStorage

## 🔐 Security

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens for stateless authentication
- Protected routes with authentication middleware
- Input validation using Zod schemas
- CORS enabled for cross-origin requests

## 📊 Database Schema

```prisma
model User {
  id        String     @id @default(uuid())
  email     String     @unique
  password  String
  documents Document[]
  createdAt DateTime   @default(now())
}

model Document {
  id        String   @id @default(uuid())
  userId    String
  content   String
  embedding Float[]  // 768-dimensional vector
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```

## 🧪 Testing

To test the application:

1. Register a new user
2. Upload a PDF document
3. Ask questions about the document content
4. View chat history in the sidebar

## 📝 License

ISC

## 👤 Author

Satyam Kumar

---

