# Prachar.ai: The Autonomous Marketing Agent for Bharat

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Stack](https://img.shields.io/badge/Tech-Next.js%2014%20|%20AWS%20Bedrock%20|%20TypeScript-blue)
![Competition](https://img.shields.io/badge/Event-AWS%20AI%20for%20Bharat%20Hackathon-orange)

**Prachar.ai** is an intelligent, agentic marketing manager designed specifically for Indian SMBs (Small & Medium Businesses). Unlike generic tools, it understands "Bharat"—generating content in **Hinglish**, tracking Indian trends (Cricket, Festivals), and strictly enforcing brand guidelines using RAG.

---

## ⚡ Key Features (The "Winning" Edge)

- **🗣️ Hinglish-First Generation:** Uses **Claude 3.5 Sonnet** to generate culturally relevant captions that mix Hindi and English naturally.
- **🎨 Brand-Safe Creatives:** Uses **Titan Image Generator v2** to create posters that respect brand colors and logo placement.
- **🤖 Agentic Workflow:** It doesn't just wait for prompts; it actively monitors trends to suggest campaigns *proactively*.
- **🧠 Knowledge Base (RAG):** "Remembers" a shop's inventory and past successful posts to avoid generic output.

---

## 🏗️ Architecture & Tech Stack

We use a **Serverless Event-Driven Architecture** to ensure scalability and low cost.

| Component | Tech Choice | Why? |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14 (App Router)** | Fast, SEO-friendly, and responsive. |
| **Orchestrator** | **Node.js (Serverless)** | Handles API requests and agent logic. |
| **Brain (Reasoning)** | **Claude 3.5 Sonnet** | Best-in-class for Indian language nuances. |
| **Creativity (Vis)** | **Titan Image Generator v2** | Superior text rendering on images. |
| **Memory** | **Vector Store (RAG)** | (Coming Soon) Stores brand PDFs. |

---

## 🛠️ Getting Started

### 1. Prerequisites

- Node.js 18+
- AWS Account with Bedrock Access (Claude 3.5 & Titan Image v2 enabled)

### 2. Installation

```bash
# Clone the repo
git clone https://github.com/your-username/prachar-ai.git

# Enter the project directory
cd prachar-ai/prachar-ai

# Install dependencies
npm install
```

### 3. Configuration

Create a `.env.local` file in the `prachar-ai` directory and add your AWS credentials:

```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the agent in action.

---

## 🚧 Current Progress (Phase 1: The Brain)

- [x] Next.js 14 Project Initialization
- [x] AWS Bedrock SDK Integration (@aws-sdk/client-bedrock-runtime)
- [x] AI Service Layer (src/lib/bedrock.ts) for Text Generation
- [x] API Route (/api/generate) for Marketing Strategy
- [ ] Next: Build the UI Dashboard (Frontend)
- [ ] Next: Integrate Titan Image Generator v2

---

## 📜 License

This project is built for the AWS AI for Bharat Hackathon 2026 by **NEONX**.
