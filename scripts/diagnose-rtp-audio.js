#!/usr/bin/env node

/**
 * Script de Diagnóstico RTP/Audio - Abmix Telefone
 * Verifica configurações críticas para funcionamento do áudio
 */

import { config } from 'dotenv';
config();

console.log('🔍 DIAGNÓSTICO RTP/AUDIO - Abmix Telefone');
console.log('==========================================\n');

// Verificar variáveis de ambiente críticas
const criticalVars = {
  'PUBLIC_IP': process.env.PUBLIC_IP,
  'FALEVONO_PASSWORD': process.env.FALEVONO_PASSWORD ? '✓ CONFIGURADA' : '❌ AUSENTE',
  'SIP_USERNAME': process.env.SIP_USERNAME || process.env.FALEVONO_USERNAME || 'Felipe_Manieri',
  'SIP_SERVER': process.env.SIP_SERVER || 'vono2.me',
  'SIP_PORT': process.env.SIP_PORT || '5060',
  'FALEVONO_SIP_PORT': process.env.FALEVONO_SIP_PORT || '6060'
};

console.log('📋 VARIÁVEIS DE AMBIENTE:');
console.log('========================');
for (const [key, value] of Object.entries(criticalVars)) {
  const status = value ? '✅' : '❌';
  console.log(`${status} ${key}: ${value || 'NÃO DEFINIDA'}`);
}

// Validar IP público
console.log('\n🌐 VALIDAÇÃO IP PÚBLICO:');
console.log('========================');
const publicIP = process.env.PUBLIC_IP;

if (!publicIP) {
  console.log('❌ PUBLIC_IP não está definido!');
  console.log('   O IP público é OBRIGATÓRIO para o RTP funcionar.');
  console.log('   Configure: PUBLIC_IP=72.60.149.107');
} else {
  // Validar formato IPv4
  const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  if (!ipRegex.test(publicIP)) {
    console.log(`❌ PUBLIC_IP "${publicIP}" não é um IPv4 válido!`);
  } else {
    // Verificar se não é IP privado
    const octets = publicIP.split('.').map(Number);
    const isPrivate = 
      octets[0] === 10 ||
      (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
      (octets[0] === 192 && octets[1] === 168) ||
      octets[0] === 127;
    
    if (isPrivate) {
      console.log(`❌ PUBLIC_IP "${publicIP}" é um IP PRIVADO!`);
      console.log('   Use o IP público do seu VPS, não o IP interno.');
    } else {
      console.log(`✅ PUBLIC_IP "${publicIP}" parece válido`);
    }
  }
}

// Verificar portas críticas
console.log('\n🔌 CONFIGURAÇÃO DE PORTAS:');
console.log('==========================');
console.log(`✅ HTTP/WebSocket: 5000`);
console.log(`✅ SIP Client: ${criticalVars.FALEVONO_SIP_PORT} (UDP)`);
console.log(`✅ RTP Media: 10000 (UDP)`);
console.log(`✅ SIP Server: ${criticalVars.SIP_SERVER}:${criticalVars.SIP_PORT}`);

// Problemas comuns e soluções
console.log('\n🚨 PROBLEMAS COMUNS DE ÁUDIO:');
console.log('==============================');
console.log('1. ❌ "Não escuto quando atendo"');
console.log('   → Problema: RTP não está chegando ao servidor');
console.log('   → Solução: Verificar PUBLIC_IP e portas UDP abertas');
console.log('');
console.log('2. ❌ "Telefone toca mas não sai áudio"');
console.log('   → Problema: SDP com IP incorreto ou porta bloqueada');
console.log('   → Solução: Confirmar network_mode: host no Docker');
console.log('');
console.log('3. ❌ "Chamada conecta mas sem áudio bilateral"');
console.log('   → Problema: Firewall bloqueando UDP 10000');
console.log('   → Solução: Abrir porta no EasyPanel/VPS');

// Comandos de teste
console.log('\n🧪 COMANDOS PARA TESTAR:');
console.log('========================');
console.log('# Testar se porta SIP está aberta:');
console.log(`nc -u -v ${criticalVars.SIP_SERVER} ${criticalVars.SIP_PORT}`);
console.log('');
console.log('# Testar se RTP está escutando:');
console.log('ss -ulnp | grep :10000');
console.log('');
console.log('# Verificar conectividade UDP:');
console.log(`nc -u -v ${publicIP} 10000`);

// Configuração recomendada EasyPanel
console.log('\n⚙️  CONFIGURAÇÃO EASYPANEL RECOMENDADA:');
console.log('======================================');
console.log('Network Mode: host (OBRIGATÓRIO)');
console.log('Portas abertas no firewall:');
console.log('  - 5000/tcp (HTTP)');
console.log('  - 6060/udp (SIP Client)');
console.log('  - 10000/udp (RTP Media)');
console.log('');
console.log('Variáveis de ambiente obrigatórias:');
console.log('  - PUBLIC_IP=72.60.149.107');
console.log('  - FALEVONO_PASSWORD=sua_senha');
console.log('  - NODE_ENV=production');

console.log('\n✅ Diagnóstico concluído!');
console.log('Para mais detalhes, consulte DEPLOY.md seção 4.4');
