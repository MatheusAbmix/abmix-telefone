# 🎯 GUIA COMPLETO DA INTERFACE ABMIX

## 📍 LOCALIZAÇÃO DE TODAS AS FUNCIONALIDADES

### 1️⃣ **PÁGINA PRINCIPAL - DISCAGEM**

#### **Tipo de Voz (3 botões no topo do discador)**
- 🧑 **Masculina** - Voz masculina da ElevenLabs
- 👩 **Feminina** - Voz feminina da ElevenLabs  
- 🤖 **Natural** - Voz neutra/natural da ElevenLabs

**Como funciona:**
- Você clica em um dos 3 botões ANTES de fazer a chamada
- A voz selecionada será usada na chamada
- O padrão é "Masculina" quando você abre o app

---

### 2️⃣ **CONFIGURAÇÕES** (Menu lateral esquerdo - ⚙️ Configurações)

Aqui você encontra TODAS as configurações avançadas:

#### **A) Configuração de Vozes ElevenLabs**
Nesta seção você escolhe QUAL voz específica usar para cada tipo:

- **Voz Masculina**: Você pode escolher entre várias vozes masculinas
  - Exemplos: Roger, Clyde, Thomas, Charlie
  - Botões verdes = voz selecionada
  - Botões brancos = outras opções disponíveis

- **Voz Feminina**: Você pode escolher entre várias vozes femininas
  - Exemplos: Sarah, Rachel, Laura, Aria
  - Botões verdes = voz selecionada
  - Botões brancos = outras opções disponíveis

- **Voz Natural**: Configuração de voz neutra (Daniel por padrão)
  - ID padrão: `onwK4e9ZLuTAKqWW03F9`

**IMPORTANTE:** As vozes que você escolhe AQUI são as que serão usadas quando você clicar nos botões Masculina/Feminina/Natural na página de discagem!

#### **B) Latência em Tempo Real**
- Mostra `--` quando não há chamada
- Mostra a latência em milissegundos (ms) durante a chamada
- Status: Excelente / Boa / Regular / Alta
- Barra de progresso com cores (verde/amarelo/vermelho)

#### **C) Níveis de Áudio (Microfone e Autofalante)**
⚠️ **AQUI ESTÃO AS 2 BARRAS DE VOLUME!**

**Barra 1 - "Nível do Microfone"**
- 🎤 Ícone de microfone
- Mostra o volume do SEU microfone
- 0% a 100%
- Cores: Verde (normal) → Amarelo (alto) → Vermelho (clipping)

**Barra 2 - "Nível de Saída (Alto-falante)"**
- 🔊 Ícone de alto-falante  
- Mostra o volume do AUTOFALANTE (som que sai)
- 0% a 100%
- Cores: Verde (normal) → Amarelo (alto) → Vermelho (clipping)

**Como testar se funciona:**
1. Vá em Configurações
2. Role a página para baixo
3. Localize a seção "Níveis de Áudio (Microfone e Autofalante)"
4. Fale próximo ao microfone → A primeira barra deve subir
5. Reproduza um som/música → A segunda barra deve subir

#### **D) Controle de Volume**
- Slider de 0 a 100
- Botão Mudo/Desmudo
- Controla o volume geral do app

#### **E) Gravação Automática**
- Switch ON/OFF
- Quando ativado, todas as chamadas são gravadas automaticamente

#### **F) Tema (Claro/Escuro)**
- Alterna entre modo claro e escuro
- Padrão: Escuro

---

## ✅ CHECKLIST DE FUNCIONALIDADES

### **DISCAGEM - Todos os botões funcionam?**
✅ Botão "Masculina" - Seleciona voz masculina  
✅ Botão "Feminina" - Seleciona voz feminina  
✅ Botão "Natural" - Seleciona voz natural  
✅ Botão "Discar" - Inicia chamada  
✅ Botão "Atender" - Atende chamada  
✅ Botão "Encerrar" - Encerra chamada  
✅ Teclado numérico (0-9, *, #) - Digita números  

### **CONFIGURAÇÕES - Tudo funcionando?**
✅ Seleção de vozes masculinas (Roger, Clyde, etc)  
✅ Seleção de vozes femininas (Sarah, Rachel, etc)  
✅ Monitor de latência (mostra -- quando idle, ms quando conectado)  
✅ Barra 1: Nível do Microfone (reage ao som do mic)  
✅ Barra 2: Nível de Saída (reage ao som do autofalante)  
✅ Slider de volume  
✅ Botão Mudo/Desmudo  
✅ Switch de Gravação Automática  
✅ Switch de Tema Claro/Escuro  

---

## 🎯 RESUMO RÁPIDO

**Para escolher tipo de voz (masc/fem/natural):**
→ Página DISCAGEM → Clique em um dos 3 botões no topo

**Para configurar QUAL voz específica usar:**
→ Menu CONFIGURAÇÕES → Seção "Configuração de Vozes ElevenLabs"

**Para ver as 2 barras de volume:**
→ Menu CONFIGURAÇÕES → Role até "Níveis de Áudio (Microfone e Autofalante)"

**Para ver a latência:**
→ Menu CONFIGURAÇÕES → Seção "Latência em Tempo Real"

---

## ❓ PERGUNTAS FREQUENTES

**P: Por que só vejo 1 barra de volume?**
R: As 2 barras estão na página CONFIGURAÇÕES (menu lateral), não na página principal de discagem.

**P: A voz Natural está funcionando?**
R: Sim! Está configurada com o ID `onwK4e9ZLuTAKqWW03F9` (voz Daniel - neutra).

**P: Onde escolho entre voz masculina e feminina?**
R: Na página DISCAGEM tem 3 botões (Masculina/Feminina/Natural). Nas CONFIGURAÇÕES você escolhe QUAL voz específica usar para cada tipo.

**P: As barras de volume não estão reagindo. É normal?**
R: Você precisa dar permissão ao navegador para acessar o microfone. Quando abrir a página de Configurações pela primeira vez, o navegador pedirá permissão.
