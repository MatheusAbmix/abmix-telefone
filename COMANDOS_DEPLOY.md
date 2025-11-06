# 🚀 Comandos de Deploy - Abmix

## 📦 1. Subir Código para Git (no Replit Shell)

```bash
# Adicionar todos os arquivos modificados
git add .

# Criar commit com mensagem descritiva
git commit -m "feat: OpenAI conversational AI integration complete"

# Enviar para o repositório
git push origin main
```

Se pedir autenticação GitHub, use Personal Access Token:
```bash
# Usar variável de ambiente se configurada
git push $GIT_URL

# Ou configurar credenciais
git config --global user.email "seu-email@example.com"
git config --global user.name "Seu Nome"
```

---

## 🖥️ 2. Deploy no VPS (EasyPanel/Docker)

### Opção A: Deploy com Docker Compose

```bash
# 1. Conectar no VPS via SSH
ssh usuario@seu-vps-ip

# 2. Clonar o repositório (primeira vez)
git clone https://github.com/seu-usuario/abmix.git
cd abmix

# 3. Criar arquivo .env com suas credenciais
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000

# Credenciais FaleVono
FALEVONO_PASSWORD=Fe120784!
FALEVONO_SIP_PORT=6060

# APIs de IA
ELEVENLABS_API_KEY=sua-key-aqui
OPENAI_API_KEY=sua-key-aqui
DEEPGRAM_API_KEY=sua-key-aqui

# Configurações SIP/RTP
SIP_USE_TCP=false
RTP_PORT=8000
EOF

# 4. Build e iniciar containers
docker-compose up -d --build

# 5. Verificar logs
docker-compose logs -f
```

### Opção B: Deploy Direto (sem Docker)

```bash
# 1. Conectar no VPS
ssh usuario@seu-vps-ip

# 2. Instalar dependências do sistema
sudo apt update
sudo apt install -y nodejs npm

# 3. Clonar e configurar
git clone https://github.com/seu-usuario/abmix.git
cd abmix

# 4. Instalar dependências
npm install

# 5. Criar .env (mesmo conteúdo acima)
nano .env

# 6. Build da aplicação
npm run build

# 7. Iniciar com PM2 (gerenciador de processos)
npm install -g pm2
pm2 start npm --name "abmix" -- start
pm2 save
pm2 startup
```

---

## 🔥 Firewall - IMPORTANTE!

**Abrir portas UDP no VPS:**

```bash
# UFW (Ubuntu/Debian)
sudo ufw allow 5000/tcp   # Web interface
sudo ufw allow 6060/udp   # SIP
sudo ufw allow 8000/udp   # RTP
sudo ufw reload

# FirewallD (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --permanent --add-port=6060/udp
sudo firewall-cmd --permanent --add-port=8000/udp
sudo firewall-cmd --reload

# iptables (genérico)
sudo iptables -A INPUT -p tcp --dport 5000 -j ACCEPT
sudo iptables -A INPUT -p udp --dport 6060 -j ACCEPT
sudo iptables -A INPUT -p udp --dport 8000 -j ACCEPT
sudo iptables-save
```

---

## 🔄 Atualizar Deploy (após mudanças)

```bash
# No VPS
cd abmix
git pull origin main

# Com Docker
docker-compose down
docker-compose up -d --build

# Sem Docker (PM2)
npm install
npm run build
pm2 restart abmix
```

---

## ✅ Verificar Status

```bash
# Testar API
curl http://localhost:5000/api/health

# Ver logs (Docker)
docker-compose logs -f

# Ver logs (PM2)
pm2 logs abmix

# Verificar portas abertas
sudo netstat -tulpn | grep -E '5000|6060|8000'
```

---

## 📱 Acessar Aplicação

Após deploy bem-sucedido:
- **Web Interface**: `http://seu-vps-ip:5000`
- **API Health**: `http://seu-vps-ip:5000/api/health`

---

## ⚡ Troubleshooting

**Se chamadas não conectam:**
1. Verificar se portas UDP 6060 e 8000 estão abertas
2. Verificar logs: `docker-compose logs -f` ou `pm2 logs`
3. Testar conectividade UDP: `nc -u -v seu-vps-ip 6060`

**Se AI não responde:**
1. Verificar OPENAI_API_KEY no .env
2. Verificar logs de erros da API OpenAI
3. Testar endpoint: `curl -X POST http://localhost:5000/api/agent/enable -H "Content-Type: application/json" -d '{"callSid": "test"}'`
