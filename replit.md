# Abmix - Sistema de Discagem Inteligente

## Overview

Abmix is an AI-powered telephony system for intelligent voice calls, offering real-time transcription, AI agent control, and advanced call management. It provides a unified interface for outbound calls, AI conversation flow management, live prompt injection, and real-time Portuguese transcription. The system integrates FaleVono for telephony, ElevenLabs for voice synthesis, and Deepgram for speech-to-text, forming a complete conversational AI telephony solution with a modern web application.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is a React with TypeScript application utilizing modern UI patterns. It employs a component-based design with shadcn/ui and Tailwind CSS for styling and responsiveness. Key decisions include React + TypeScript for type safety, Zustand for state management, TanStack Query for server state, Wouter for routing, and WebSocket for real-time communication.

### Backend Architecture
The server uses Express.js with TypeScript, providing a REST API and WebSocket support. It features a provider pattern for telephony services (e.g., FaleVono, SobreIP, Twilio) and modular service organization. SQLite is used for local persistence of VoIP numbers, calls, recordings, and favorites. Sensitive credentials are stored exclusively in environment variables.

### Data Storage Solutions
The system currently uses in-memory storage with interfaces designed for future database migration. Drizzle ORM is configured for PostgreSQL with schema definitions for calls, transcripts, and prompts.

### Real-time Communication
WebSocket integration enables bi-directional communication for call state updates, live transcription streaming, AI agent status changes, latency monitoring, and error notifications.

## External Dependencies

### Telephony Providers
- **FaleVono**: Primary Brazilian VoIP provider via SIP protocol.
- **SobreIP**: Alternative Brazilian VoIP provider.
- **Twilio**: Optional alternative for granular telephony control with Media Streams.
- **Vapi**: (Future integration) AI voice platform.
- **Retell AI**: (Future integration) Alternative AI voice provider.

### AI and Speech Services
- **ElevenLabs**: Primary TTS/STT service for Portuguese voice synthesis and transcription via WebSocket.
- **Deepgram**: For real-time Portuguese speech-to-text transcription.
- **OpenAI**: Integrated for AI conversation logic and live prompt injection.

### Frontend Dependencies
- **shadcn/ui**: React component library built on Radix UI.
- **Radix UI**: Unstyled, accessible component primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: Icon library.
- **React Hook Form**: Form handling with validation.

### Development and Build Tools
- **Vite**: Fast build tool and development server.
- **TypeScript**: Static typing for frontend and backend.
- **Drizzle Kit**: Database migration and schema management.