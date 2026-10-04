import { config } from './config/index.js';
import { loadPlugins } from './lib/pluginLoader.js';
import { startWhatsAppBot } from './lib/connection.js';
import { handleMessage } from './lib/commandHandler.js';

async function main() {
  console.log(`\n========================================`);
  console.log(` Starting ${config.botName} WhatsApp Bot...`);
  console.log(`========================================\n`);

  // Load plugins
  const { commands, pluginInfo } = await loadPlugins(config.pluginsDir);
  console.log(`[Main] Successfully loaded ${commands.size} command handlers from ${pluginInfo.length} plugins.`);

  // Start WhatsApp connection
  await startWhatsAppBot(async (sock, m) => {
    await handleMessage(sock, m, commands);
  });

  // Graceful shutdown handling
  process.on('SIGINT', () => {
    console.log('\n[Main] Gracefully shutting down WhatsApp bot...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n[Main] Gracefully shutting down WhatsApp bot...');
    process.exit(0);
  });
}

main().catch(err => {
  console.error('[Main] Fatal error starting bot:', err);
});
