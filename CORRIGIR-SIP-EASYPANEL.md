# ✅ Correção Definitiva do SIP no EasyPanel

## O Problema
O EasyPanel está rodando código antigo com o bug: `sip.send is not a function`

## Solução em 2 Comandos Simples

### 1️⃣ Conecte no VPS via SSH

No PowerShell:
```powershell
ssh root@72.60.149.107
```

### 2️⃣ Execute este comando único

Cole isto no terminal SSH:

```bash
curl -s https://replit.com/@FelipeManieri/abmix-telefone/fix-sip-easypanel.sh | bash
```

**OU** copie e cole este bloco completo:

```bash
CONTAINER="projeto-abmix-tech_abmix-telefone.1.oy173vonhph0hvvgp5l73nzma"
echo "🔧 Corrigindo SIP..."
docker exec $CONTAINER cp /app/server/sipService.ts /app/server/sipService.ts.backup
docker exec $CONTAINER sh -c "sed -i 's/const sip = require('\''sip'\'').default || require('\''sip'\'');/const sip = require('\''sip'\'');/g' /app/server/sipService.ts"
echo "🔨 Rebuild..."
docker exec $CONTAINER npm run build
echo "🔄 Reiniciando..."
docker restart $CONTAINER
sleep 30
echo "✅ Logs:"
docker logs $CONTAINER --tail 50 | grep -E "SIP_MODULE|Username|Registration"
```

### 3️⃣ Validar Resultado

**✅ Sucesso - Deve aparecer:**
```
[SIP_MODULE] ✅ SIP module loaded successfully
[FALEVONO_PROVIDER] Username: Felipe_Manieri
```

**❌ Se ainda aparecer:**
```
sip.send is not a function
Username: Fe120784!
```

Rode o comando novamente ou me avise.

---

## 📋 Comandos Úteis

### Ver logs em tempo real:
```bash
docker logs -f projeto-abmix-tech_abmix-telefone.1.oy173vonhph0hvvgp5l73nzma
```

### Ver apenas erros SIP:
```bash
docker logs projeto-abmix-tech_abmix-telefone.1.oy173vonhph0hvvgp5l73nzma --tail 100 | grep -E "SIP|Username|Registration|Failed"
```

### Restaurar backup (se der problema):
```bash
docker exec projeto-abmix-tech_abmix-telefone.1.oy173vonhph0hvvgp5l73nzma cp /app/server/sipService.ts.backup /app/server/sipService.ts
docker exec projeto-abmix-tech_abmix-telefone.1.oy173vonhph0hvvgp5l73nzma npm run build
docker restart projeto-abmix-tech_abmix-telefone.1.oy173vonhph0hvvgp5l73nzma
```
