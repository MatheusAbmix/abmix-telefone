// Script para limpar banco SQLite no EasyPanel
// Execute dentro do container: node fix-easypanel-sqlite.js
import Database from 'better-sqlite3';

const db = new Database('data/app.db');

console.log('📋 Números atuais no banco:');
const numbers = db.prepare('SELECT id, name, number, sip_username, sip_server FROM voip_numbers').all();
console.table(numbers);

// Remover números com username incorreto (senha ao invés de username)
console.log('\n🗑️  Removendo números com username incorreto...');
const deleteWrongUsername = db.prepare("DELETE FROM voip_numbers WHERE sip_username = 'Fe120784!'").run();
console.log(`✅ ${deleteWrongUsername.changes} número(s) com username errado removido(s)`);

// Garantir que existe apenas o número correto da FaleVono
const existingCorrect = db.prepare("SELECT COUNT(*) as count FROM voip_numbers WHERE number = '+5511920838833' AND sip_username = 'Felipe_Manieri'").get();

if (existingCorrect.count === 0) {
  console.log('\n➕ Inserindo número correto da FaleVono...');
  db.prepare(`
    INSERT INTO voip_numbers (name, number, provider, sip_username, sip_password, sip_server, is_default, status)
    VALUES ('FaleVono - SP', '+5511920838833', 'falevono', 'Felipe_Manieri', 'WILL_USE_ENV_VAR', 'vono2.me:5060', 1, 'active')
  `).run();
  console.log('✅ Número da FaleVono adicionado');
} else {
  console.log('\n✅ Número correto da FaleVono já existe');
}

console.log('\n📋 Números após limpeza:');
const numbersAfter = db.prepare('SELECT id, name, number, sip_username, sip_server, is_default FROM voip_numbers').all();
console.table(numbersAfter);

db.close();
console.log('\n✅ Banco do EasyPanel corrigido com sucesso!');
console.log('📌 Próximo passo: Reinicie a aplicação no EasyPanel');
