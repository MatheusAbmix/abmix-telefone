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
# Configurar credenciais
git config --global user.email "seu-email@example.com"
git config --global user.name "Seu Nome"

# Push com token
git push https://SEU_USUARIO:SEU_TOKEN@github.com/SEU_USUARIO/abmix.git main
```

---

## 🖥️ 2. Deploy no VPS (EasyPanel/Docker)

### ⚠️ USE O SCRIPT AUTOMÁTICO!

**MELHOR OPÇÃO:** Use o arquivo `deploy-vps.sh` que faz tudo automaticamente!

1. Conectar no VPS:
```bash
ssh root@IP_DO_VPS
```

2. Criar e executar o script:
```bash
nano deploy.sh
# Cole o conteúdo de deploy-vps.sh
# Ctrl+X, Y, Enter

chmod +x deploy.sh
./deploy.sh
```

3. O script vai:
   - ✅ Instalar Node.js 20 e PM2
   - ✅ Clonar repositório
   - ✅ Pedir credenciais (seguro)
   - ✅ Criar .env protegido
   - ✅ Build do projeto
   - ✅ Configurar firewall
   - ✅ Iniciar servidor
   - ✅ Configurar autostart

---

### Opção Manual (Deploy com Docker Compose)

```bash
# 1. Conectar no VPS via SSH
ssh usuario@seu-vps-ip

# 2. Clonar o repositório (primeira vez)
git clone https://github.com/seu-usuario/abmix.git
cd abmix

# 3. Criar arquivo .env com suas credenciais
nano .env
# Cole suas credenciais de forma segura

# 4. Build e iniciar containers
docker-compose up -d --build

# 5. Verificar logs
docker-compose logs -f
```

---

## 🔥 Firewall - IMPORTANTE!

**Abrir portas UDP no VPS:**

```bash
# UFW (Ubuntu/Debian)
sudo ufw allow 5000/tcp   # Web interface
sudo ufw allow 5060/udp   # SIP (porta correta!)
sudo ufw allow 8000/udp   # RTP
sudo ufw reload

# FirewallD (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --permanent --add-port=5060/udp
sudo firewall-cmd --permanent --add-port=8000/udp
sudo firewall-cmd --reload

# iptables (genérico)
sudo iptables -A INPUT -p tcp --dport 5000 -j ACCEPT
sudo iptables -A INPUT -p udp --dport 5060 -j ACCEPT
sudo iptables -A INPUT -p udp --dport 8000 -j ACCEPT
sudo iptables-save
```

**⚠️ ATENÇÃO:** Porta SIP é **5060** (não 6060!)

---

## 🔄 Atualizar Deploy (após mudanças)

```bash
# No VPS
cd /root/abmix
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

# Verificar portas abertas (deve mostrar 5060 e 8000)
sudo netstat -tulpn | grep -E '5000|5060|8000'
```

---

## 📱 Acessar Aplicação

Após deploy bem-sucedido:
- **Web Interface**: `http://seu-vps-ip:5000`
- **API Health**: `http://seu-vps-ip:5000/api/health`

---

## ⚡ Troubleshooting

**Se chamadas não conectam:**
1. Verificar se portas UDP 5060 e 8000 estão abertas
2. Verificar logs: `pm2 logs abmix`
3. Testar conectividade UDP: `nc -u -v vono2.me 5060`

**Se AI não responde:**
1. Verificar OPENAI_API_KEY no .env
2. Verificar logs de erros da API OpenAI
3. Testar endpoint: `curl http://localhost:5000/api/health`

---

## 🔒 Segurança

⚠️ **NUNCA** faça commit de credenciais no Git!

- Use o script `deploy-vps.sh` que pede credenciais de forma segura
- Arquivo `.env` é protegido com `chmod 600`
- Credenciais ficam apenas no servidor
