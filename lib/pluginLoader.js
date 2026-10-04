import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export async function loadPlugins(pluginsDir) {
  const commands = new Map();
  const pluginInfo = [];

  if (!fs.existsSync(pluginsDir)) {
    fs.mkdirSync(pluginsDir, { recursive: true });
    return { commands, pluginInfo };
  }

  const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js') || file.endsWith('.mjs'));

  for (const file of files) {
    const filePath = path.join(pluginsDir, file);
    try {
      const fileUrl = pathToFileURL(filePath).href;
      // Add timestamp query or load module
      const plugin = await import(fileUrl);
      const pluginModule = plugin.default || plugin;

      if (pluginModule && typeof pluginModule.name === 'string' && typeof pluginModule.execute === 'function') {
        const names = Array.isArray(pluginModule.name) ? pluginModule.name : [pluginModule.name];
        for (const name of names) {
          commands.set(name.toLowerCase(), {
            execute: pluginModule.execute,
            description: pluginModule.description || 'No description provided',
            category: pluginModule.category || 'General',
            ownerOnly: !!pluginModule.ownerOnly,
            usage: pluginModule.usage || `.${name}`
          });
        }
        pluginInfo.push({
          file,
          names,
          description: pluginModule.description || 'No description',
          category: pluginModule.category || 'General'
        });
        console.log(`[PluginLoader] Loaded plugin: ${file} (${names.join(', ')})`);
      } else {
        console.warn(`[PluginLoader] Warning: ${file} does not export a valid plugin format (name & execute).`);
      }
    } catch (error) {
      console.error(`[PluginLoader] Error loading plugin ${file}:`, error);
    }
  }

  return { commands, pluginInfo };
}
