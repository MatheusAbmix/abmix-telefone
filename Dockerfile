# Dockerfile para produção - Abmix VoIP System
# Otimizado para VPS com suporte a SIP/UDP

FROM node:20-alpine AS base

# Instalar dependências do sistema necessárias para SIP
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    curl \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Stage de build
FROM base AS builder

# Instalar todas as dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build do frontend (Vite)
RUN npm run build

# Stage de produção
FROM base AS production

# Instalar apenas dependências de produção
RUN npm ci --only=production

# Copiar build do frontend e código do backend
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/data ./data
COPY --from=builder /app/package*.json ./

# Criar diretório para dados persistentes
RUN mkdir -p /app/data

# Expor portas
# 5000 - HTTP/WebSocket (frontend + backend)
# 6060/udp - SIP client
EXPOSE 5000
EXPOSE 6060/udp

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicialização
CMD ["npm", "start"]
