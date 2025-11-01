import { db, queries } from './database';

console.log('[SEED] Inserting default VoIP number...');

try {
  // Check if already exists
  const existing = queries.getAllVoipNumbers.all();
  
  if (existing.length === 0) {
    queries.addVoipNumber.run(
      'SP Principal',
      '+5511951944022',
      'sobreip',
      '1151944022',
      null, // SECURITY: Password must be configured in SOBREIP_PASSWORD env var
      'voz.sobreip.com.br',
      1, // is_default (SQLite uses 1/0 for boolean)
      'active'
    );
    console.log('[SEED] ✅ VoIP number added successfully!');
    console.log('[SEED] ⚠️  Remember to configure SOBREIP_PASSWORD environment variable');
  } else {
    console.log('[SEED] ℹ️  VoIP numbers already exist:', existing.length);
    existing.forEach((num: any) => {
      console.log(`  - ${num.name} (${num.number}) - ${num.provider} ${num.is_default ? '⭐' : ''}`);
    });
  }
} catch (error) {
  console.error('[SEED] ❌ Error seeding VoIP number:', error);
}
