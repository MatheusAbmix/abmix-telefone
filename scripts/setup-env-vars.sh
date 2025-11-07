#!/bin/bash

# Script para configurar variáveis de ambiente no EasyPanel
# Execute este script no servidor ou copie as variáveis para o painel

echo "🔧 CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE - ABMIX"
echo "================================================"

echo ""
echo "📋 COPIE E COLE ESTAS VARIÁVEIS NO EASYPANEL:"
echo "============================================="

cat << 'EOF'
NODE_ENV=production
PORT=5000
PUBLIC_IP=72.60.149.107
FALEVONO_PASSWORD=Fe120784!
SIP_USERNAME=Felipe_Manieri
SIP_PASSWORD=Fe120784!
SIP_ENABLED=true
SIP_SERVER=vono2.me
SIP_DOMAIN=vono2.me
SIP_PROXY=vono2.me
SIP_PORT=5060
SIP_TRANSPORT=udp
SIP_REALM=vono2.me
FALEVONO_SIP_PORT=6060
ELEVENLABS_API_KEY=sk_sua_chave_elevenlabs_aqui
DEEPGRAM_API_KEY=sua_chave_deepgram_aqui
OPENAI_API_KEY=sk-proj-sua_chave_openai_aqui
SOBREIP_PASSWORD=sua_senha_sobreip
SESSION_SECRET=sua_chave_secreta_longa_e_aleatoria
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_seu_token_github_aqui
EOF

echo ""
echo "🚨 VARIÁVEIS CRÍTICAS PARA ÁUDIO FUNCIONAR:"
echo "==========================================="
echo "✅ PUBLIC_IP=72.60.149.107 (IP público do VPS)"
echo "✅ FALEVONO_PASSWORD=Fe120784! (senha SIP)"
echo "✅ NODE_ENV=production"
echo ""

echo "📋 INSTRUÇÕES EASYPANEL:"
echo "========================"
echo "1. Acesse seu app no EasyPanel"
echo "2. Vá em Environment Variables"
echo "3. Adicione CADA variável acima"
echo "4. Salve as configurações"
echo "5. Faça Redeploy do app"
echo ""

echo "🔌 CONFIGURAÇÃO DE REDE OBRIGATÓRIA:"
echo "===================================="
echo "Network Mode: host"
echo "OU mapeie as portas:"
echo "  - 5000:5000/tcp"
echo "  - 6060:6060/udp"  
echo "  - 10000:10000/udp"
echo ""

echo "✅ Após configurar, teste com:"
echo "node scripts/diagnose-rtp-audio.js"
