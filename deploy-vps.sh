#!/bin/bash
# Deploy Abmix - SIMPLES E DIRETO
set -e

echo "🚀 Instalando Abmix..."

# Node.js
echo "📦 Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

# PM2
echo "📦 Instalando PM2..."
sudo npm install -g pm2

# Repositório
echo "📥 Qual o repositório? (ex: https://github.com/usuario/abmix)"
read -p "URL: " REPO_URL

cd /root
rm -rf abmix 2>/dev/null || true
git clone "$REPO_URL" abmix
cd abmix

# .env
echo "🔧 Criando .env..."
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
SESSION_SECRET=p9Wkc/bD+vGCzCk1xVR3/+3gCoXvJOpfUx+S/ETop+DUjYX23HGI6YsgNZTxqiiWvtjWU2rVxLd9hGVQHSTgQQ==

DEEPGRAM_API_KEY=e81295a63e96b3283c22c1de5db9af5dd1466b85
ELEVENLABS_API_KEY=sk_58ab581ca38280c62eb8d560b3288c9ae2d9184d62a42cfe
OPENAI_API_KEY=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

VOIP_NUMBER=+5511920838833
SIP_ENABLED=true
SIP_SERVER=vono2.me
SIP_DOMAIN=vono2.me
SIP_PROXY=vono2.me
SIP_PORT=5060
SIP_TRANSPORT=udp
SIP_REALM=vono2.me
SIP_USERNAME=Felipe_Manieri
SIP_PASSWORD=Fe120784!
FALEVONO_PASSWORD=Fe120784!

RTP_PORT=8000
EOF

chmod 600 .env

# Build
echo "🔨 Instalando e compilando..."
npm install
npm run build

# Firewall
echo "🔥 Configurando firewall..."
sudo ufw --force enable
sudo ufw allow 22/tcp
sudo ufw allow 5000/tcp
sudo ufw allow 5060/udp
sudo ufw allow 8000/udp
sudo ufw reload

# PM2
echo "🚀 Iniciando..."
pm2 stop abmix 2>/dev/null || true
pm2 delete abmix 2>/dev/null || true
pm2 start npm --name "abmix" -- start
pm2 save
pm2 startup systemd -u root --hp /root

PUBLIC_IP=$(curl -s ifconfig.me)

echo ""
echo "✅ PRONTO!"
echo "Acesse: http://$PUBLIC_IP:5000"
echo ""
echo "Comandos:"
echo "  pm2 logs abmix"
echo "  pm2 restart abmix"
