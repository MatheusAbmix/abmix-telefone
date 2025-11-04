// Script para limpar números duplicados do SQLite local
import Database from 'better-sqlite3';

const db = new Database('data/app.db');

console.log('📋 Números atuais no banco:');
const numbers = db.prepare('SELECT id, name, number, sip_username FROM voip_numbers').all();
console.table(numbers);

console.log('\n🗑️  Removendo números com username incorreto (Fe120784!)...');
const deleteResult = db.prepare("DELETE FROM voip_numbers WHERE sip_username = 'Fe120784!'").run();
console.log(`✅ ${deleteResult.changes} número(s) removido(s)`);

console.log('\n📋 Números após limpeza:');
const numbersAfter = db.prepare('SELECT id, name, number, sip_username FROM voip_numbers').all();
console.table(numbersAfter);

db.close();
console.log('\n✅ Banco local limpo com sucesso!');
