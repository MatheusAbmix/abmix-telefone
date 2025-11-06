# 🚀 Deploy Rápido - Abmix VPS

## ⚠️ IMPORTANTE: Credenciais

**NUNCA compartilhe suas API keys!** O script vai pedir de forma segura durante a instalação.

Tenha em mãos:
- ✅ OPENAI_API_KEY
- ✅ ELEVENLABS_API_KEY  
- ✅ DEEPGRAM_API_KEY
- ✅ FALEVONO_PASSWORD

---

## Passo 1️⃣: Conectar no VPS

```bash
ssh root@72.60.149.107
```

---

## Passo 2️⃣: Baixar e Executar Script

### Opção A: Download direto (se estiver no GitHub)

```bash
curl -o deploy.sh https://raw.githubusercontent.com/SEU_USUARIO/abmix/main/deploy-vps.sh
chmod +x deploy.sh
./deploy.sh
```

### Opção B: Copiar e colar

1. No VPS, crie o arquivo:
```bash
nano deploy.sh
```

2. Cole todo o conteúdo do arquivo `deploy-vps.sh` (do seu projeto)

3. Saia salvando: `Ctrl+X`, depois `Y`, depois `Enter`

4. Execute:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Passo 3️⃣: Fornecer Informações

O script vai pedir:

1. **URL do repositório GitHub**
   ```
   https://github.com/seu-usuario/abmix
   ```

2. **OPENAI_API_KEY**
   ```
   Cole sua chave OpenAI aqui
   ```

3. **ELEVENLABS_API_KEY**
   ```
   Cole sua chave ElevenLabs aqui
   ```

4. **DEEPGRAM_API_KEY**
   ```
   Cole sua chave Deepgram aqui
   ```

5. **FALEVONO_PASSWORD**
   ```
   Cole sua senha FaleVono aqui
   ```

---

## Passo 4️⃣: Aguardar Instalação

O script vai automaticamente:
- ✅ Instalar Node.js 20
- ✅ Instalar PM2
- ✅ Clonar repositório
- ✅ Criar .env com suas credenciais (PROTEGIDO)
- ✅ Instalar dependências
- ✅ Build do projeto
- ✅ Configurar firewall (portas corretas: 5060 SIP, 8000 RTP)
- ✅ Iniciar servidor
- ✅ Configurar autostart (sobrevive a reboots)
- ✅ Testar API

---

## Passo 5️⃣: Acessar Sistema

Após conclusão, acesse:
```
http://72.60.149.107:5000
```

---

## 🔄 Atualizar Depois (Após mudanças no código)

```bash
cd /root/abmix
git pull origin main
npm install
npm run build
pm2 restart abmix
```

---

## 🔧 Comandos Úteis

```bash
# Ver status
pm2 status

# Ver logs ao vivo
pm2 logs abmix

# Ver apenas erros
pm2 logs abmix --err

# Reiniciar
pm2 restart abmix

# Parar
pm2 stop abmix

# Monitor em tempo real
pm2 monit
```

---

## ⚠️ Troubleshooting

### Chamadas não conectam

```bash
# 1. Verificar portas abertas (deve mostrar 5060 e 8000)
sudo netstat -tulpn | grep -E '5000|5060|8000'

# 2. Ver logs de SIP
pm2 logs abmix | grep SIP

# 3. Testar conectividade SIP
nc -u -v vono2.me 5060

# 4. Reiniciar serviço
pm2 restart abmix
```

### API não responde

```bash
# Ver logs completos
pm2 logs abmix

# Verificar se está rodando
pm2 status

# Reiniciar
pm2 restart abmix
```

### Editar credenciais

```bash
cd /root/abmix
nano .env
# Edite as credenciais
pm2 restart abmix
```

---

## 🔒 Segurança

✅ **Arquivo .env protegido** (chmod 600)  
✅ **Credenciais NUNCA no código**  
✅ **SESSION_SECRET gerado aleatoriamente**  
✅ **Firewall configurado (apenas portas necessárias)**

⚠️ **NUNCA** compartilhe o arquivo `.env` ou faça commit dele no Git!

---

## 📋 Portas Configuradas

- **5000/tcp** - Interface Web
- **5060/udp** - SIP (FaleVono) ← Porta correta!
- **8000/udp** - RTP (Áudio em tempo real)

---

## ✅ Checklist Pós-Deploy

- [ ] Consegue acessar http://IP:5000
- [ ] VoIP Numbers mostra FaleVono conectado
- [ ] Consegue fazer chamada teste
- [ ] Áudio funciona (RTP conectado)
- [ ] IA responde durante chamada
- [ ] Logs não mostram erros críticos

```bash
# Verificar tudo de uma vez
pm2 status && curl http://localhost:5000/api/health && pm2 logs abmix --lines 50
```

---

## 🎯 Sistema Completo

Após deploy bem-sucedido, você terá:

✅ **Backend rodando** - Express + SIP + RTP  
✅ **Frontend acessível** - React interface  
✅ **FaleVono conectado** - SIP registrado  
✅ **OpenAI ativo** - Conversas autônomas  
✅ **ElevenLabs/Deepgram** - Voz PT-BR  
✅ **Autostart configurado** - Reinicia após reboot  
✅ **Firewall protegido** - Apenas portas necessárias
