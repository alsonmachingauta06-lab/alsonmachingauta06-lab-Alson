import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Terminal, 
  Cpu, 
  Shield, 
  Smartphone, 
  RefreshCw, 
  Play, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Code, 
  FolderGit2, 
  MessageSquare,
  Sparkles,
  Zap,
  Lock,
  Unlock,
  Send,
  BadgeCheck,
  Eye,
  UserCheck,
  Copy,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'minibot' | 'dashboard' | 'pairing' | 'plugins' | 'ai' | 'logs' | 'settings'>('minibot');
  const [statusData, setStatusData] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Mini Bot state
  const [miniPhone, setMiniPhone] = useState('263783549857');
  const [copied, setCopied] = useState(false);

  // Settings form
  const [botName, setBotName] = useState('ALSON-XMD');
  const [prefix, setPrefix] = useState('.');
  const [ownerNumbers, setOwnerNumbers] = useState('263786359833,263783549857');
  const [pairingNumber, setPairingNumber] = useState('263783549857');
  const [pairingBrand, setPairingBrand] = useState('ALSON-XMD');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [aiProvider, setAiProvider] = useState('gemini');
  const [aiModel, setAiModel] = useState('gemini-3.8-flash');
  const [chatbotEnabled, setChatbotEnabled] = useState(false);
  const [chatbotGroups, setChatbotGroups] = useState(false);
  const [chatbotPrivate, setChatbotPrivate] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');

  // Test command console
  const [testCmd, setTestCmd] = useState('.ai What is Node.js?');
  const [testOutput, setTestOutput] = useState('');
  const [testing, setTesting] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setStatusData(data);
      if (data.botName) setBotName(data.botName);
      if (data.prefix !== undefined) setPrefix(data.prefix);
      if (data.ownerNumbers) setOwnerNumbers(data.ownerNumbers);
      if (data.pairingNumber) {
        setPairingNumber(data.pairingNumber);
        setMiniPhone(data.pairingNumber);
      }
      if (data.pairingBrand) setPairingBrand(data.pairingBrand);
      if (data.aiProvider) setAiProvider(data.aiProvider);
      if (data.aiModel) setAiModel(data.aiModel);
      if (data.chatbotEnabled !== undefined) setChatbotEnabled(data.chatbotEnabled);
      if (data.chatbotGroups !== undefined) setChatbotGroups(data.chatbotGroups);
      if (data.chatbotPrivate !== undefined) setChatbotPrivate(data.chatbotPrivate);
    } catch (err: any) {
      console.error('Failed to fetch status:', err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err: any) {
      console.error('Failed to fetch logs:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchLogs();
    const interval = setInterval(() => {
      fetchStatus();
      fetchLogs();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartBot = async () => {
    setLoading(true);
    try {
      await fetch('/api/start-bot', { method: 'POST' });
      await fetchStatus();
    } catch (err: any) {
      console.error('Failed to start bot:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (statusData?.pairingCode) {
      navigator.clipboard.writeText(statusData.pairingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMessage('');
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          botName, 
          prefix, 
          ownerNumbers, 
          pairingNumber, 
          pairingBrand, 
          geminiApiKey,
          aiProvider,
          aiModel,
          chatbotEnabled,
          chatbotGroups,
          chatbotPrivate
        })
      });
      const data = await res.json();
      if (data.success) {
        setSettingsMessage('Settings saved successfully!');
        fetchStatus();
      } else {
        setSettingsMessage('Failed to save settings.');
      }
    } catch (err: any) {
      setSettingsMessage('Error saving settings.');
    }
  };

  const handleTestCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testCmd) return;
    setTesting(true);
    setTestOutput('Executing command...');
    try {
      const res = await fetch('/api/test-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: testCmd })
      });
      const data = await res.json();
      setTestOutput(data.response || 'No response returned.');
    } catch (err: any) {
      setTestOutput('Error executing command: ' + err.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar Contract */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              ALSON-XMD MINI BOT
              <BadgeCheck className="w-4 h-4 text-blue-400 fill-blue-500/20" />
            </h1>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Mobile Dashboard</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <span className={`w-2 h-2 rounded-full ${statusData?.connectionStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                {statusData?.connectionStatus || 'disconnected'}
              </span>
            </div>
          </div>
        </div>

        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button onClick={() => setActiveTab('minibot')} className={`hover:text-white transition-colors ${activeTab === 'minibot' ? 'text-emerald-400 font-semibold' : ''}`}>Mini Bot</button>
          <button onClick={() => setActiveTab('dashboard')} className={`hover:text-white transition-colors ${activeTab === 'dashboard' ? 'text-emerald-400 font-semibold' : ''}`}>Dashboard</button>
          <button onClick={() => setActiveTab('pairing')} className={`hover:text-white transition-colors ${activeTab === 'pairing' ? 'text-emerald-400 font-semibold' : ''}`}>Pairing & Session</button>
          <button onClick={() => setActiveTab('plugins')} className={`hover:text-white transition-colors ${activeTab === 'plugins' ? 'text-emerald-400 font-semibold' : ''}`}>Plugins</button>
          <button onClick={() => setActiveTab('ai')} className={`hover:text-white transition-colors ${activeTab === 'ai' ? 'text-emerald-400 font-semibold' : ''}`}>AI Console</button>
          <button onClick={() => setActiveTab('logs')} className={`hover:text-white transition-colors ${activeTab === 'logs' ? 'text-emerald-400 font-semibold' : ''}`}>Logs</button>
          <button onClick={() => setActiveTab('settings')} className={`hover:text-white transition-colors ${activeTab === 'settings' ? 'text-emerald-400 font-semibold' : ''}`}>Settings</button>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleStartBot} 
            disabled={loading}
            className="px-3 sm:px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg shadow-emerald-950/50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {loading ? 'Starting...' : 'Start Bot'}
          </button>
        </div>
      </header>

      {/* Mobile Nav Tabs */}
      <div className="flex xl:hidden overflow-x-auto px-4 py-2.5 bg-slate-900 border-b border-slate-800 gap-2 text-xs">
        <button onClick={() => setActiveTab('minibot')} className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${activeTab === 'minibot' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}>Mini Bot</button>
        <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}>Dashboard</button>
        <button onClick={() => setActiveTab('pairing')} className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'pairing' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}>Pairing</button>
        <button onClick={() => setActiveTab('plugins')} className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'plugins' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}>Plugins</button>
        <button onClick={() => setActiveTab('ai')} className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'ai' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}>AI</button>
        <button onClick={() => setActiveTab('logs')} className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'logs' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}>Logs</button>
        <button onClick={() => setActiveTab('settings')} className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'settings' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}>Settings</button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">

        {/* MINIBOT TAB (Primary requested UI) */}
        {activeTab === 'minibot' && (
          <div className="space-y-6 max-w-lg mx-auto py-2">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
              
              {/* Header & Title */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                  <Bot className="w-8 h-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">ALSON-XMD MINI BOT</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Connect your WhatsApp number securely using Baileys multi-device pairing.
                </p>
              </div>

              {/* Connection Status Indicator */}
              <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800/80 rounded-xl px-4 py-3">
                <span className="text-xs text-slate-400 font-medium">Connection Status</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${statusData?.connectionStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    {statusData?.connectionStatus || 'Disconnected'}
                  </span>
                </div>
              </div>

              {/* WhatsApp Number Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">WhatsApp Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={miniPhone}
                    onChange={(e) => setMiniPhone(e.target.value)}
                    placeholder="e.g. 263783549857"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Enter your international phone number without '+' or spaces.</p>
              </div>

              {/* GET PAIRING CODE Button */}
              <button 
                onClick={handleStartBot}
                disabled={loading}
                className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 text-sm"
              >
                <Smartphone className="w-4 h-4" />
                {loading ? 'Requesting Code...' : 'GET PAIRING CODE'}
              </button>

              {/* Pairing Code Display Box & Copy Button */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center space-y-3">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Pairing Code</div>
                <div className="text-2xl sm:text-3xl font-mono font-bold tracking-widest text-emerald-400 select-all py-1">
                  {statusData?.pairingCode ? statusData.pairingCode.match(/.{1,4}/g)?.join('-') : '---- - ----'}
                </div>
                <button 
                  onClick={handleCopyCode}
                  disabled={!statusData?.pairingCode}
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-semibold rounded-lg text-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copied to Clipboard!' : 'Copy Pairing Code'}
                </button>
              </div>

              {/* JOIN CHANNEL & JOIN GROUP Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a 
                  href="https://whatsapp.com/channel/0029Va9uzIv89inPl3kCsh31" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors text-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  JOIN CHANNEL
                </a>
                <a 
                  href="https://chat.whatsapp.com/ExsampleGroupLink" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors text-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  JOIN GROUP
                </a>
              </div>

            </div>
          </div>
        )}

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Connection Status</span>
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold capitalize text-white">{statusData?.connectionStatus || 'Disconnected'}</div>
                <div className="text-xs text-slate-500">Multi-Device Baileys Protocol</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Loaded Plugins</span>
                  <FolderGit2 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white tabular-nums">{statusData?.plugins?.length || 0} Modules</div>
                <div className="text-xs text-slate-500">Includes .getpp, .vv, .ai</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Bot Owners (2)</span>
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-1 mt-1">
                  <span>263786359833</span>
                  <BadgeCheck className="w-4 h-4 text-blue-400 fill-blue-500/20 inline" />
                </div>
                <div className="text-xs text-slate-500">Verified Owner Permissions</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>AI Chatbot Auto-Reply</span>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">{statusData?.chatbotEnabled ? 'Enabled' : 'Disabled'}</div>
                <div className="text-xs text-slate-500">Provider: {statusData?.aiProvider || 'gemini'}</div>
              </div>
            </div>
          </div>
        )}

        {/* PAIRING TAB */}
        {activeTab === 'pairing' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white">ALSON-XMD Pairing & Connection</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Connect your WhatsApp account using phone-number pairing code or terminal QR code.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" /> Phone Number Pairing Code (pair.js)
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Default pairing number: <code className="text-emerald-300">{statusData?.pairingNumber}</code>. Verified owners can also use the <code className="text-emerald-300">.pair &lt;number&gt;</code> command.
                  </p>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-center">
                    <div className="text-xs text-slate-400 mb-1">{statusData?.pairingBrand || 'ALSON-XMD'} Pairing Code</div>
                    <div className="text-3xl font-mono font-bold tracking-widest text-emerald-400">
                      {statusData?.pairingCode ? statusData.pairingCode.match(/.{1,4}/g)?.join('-') : 'NOT GENERATED'}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h4 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Connection Status
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm py-2 border-b border-slate-800/80">
                      <span className="text-slate-400">Status</span>
                      <span className="font-semibold uppercase text-emerald-400">{statusData?.connectionStatus || 'Disconnected'}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b border-slate-800/80">
                      <span className="text-slate-400">Session Storage</span>
                      <span className="font-semibold text-slate-200">{statusData?.sessionExists ? 'session/ directory (Linked)' : 'Empty'}</span>
                    </div>
                    <button 
                      onClick={handleStartBot}
                      className="w-full mt-2 py-2 px-4 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-500 transition-colors"
                    >
                      Reconnect / Re-initialize Bot
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PLUGINS TAB */}
        {activeTab === 'plugins' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Installed Plugins & Commands</h3>
                  <p className="text-sm text-slate-400 mt-1">Includes new plugins and modules.</p>
                </div>
                <div className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">
                  Total: {statusData?.plugins?.length || 0} plugins
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {statusData?.plugins?.map((plugin: any, index: number) => (
                  <div key={index} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-400 font-mono">{plugin.file}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">{plugin.category}</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      Commands: {plugin.names?.map((n: string) => `.${n}`).join(', ')}
                    </div>
                    <div className="text-xs text-slate-400">{plugin.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI CONSOLE TAB */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white">AI Chatbot & Command Test Console</h3>
                <p className="text-sm text-slate-400 mt-1">Test AI queries (<code className="text-emerald-300">.ai</code>) or owner commands.</p>
              </div>

              <form onSubmit={handleTestCommand} className="space-y-4">
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={testCmd}
                    onChange={(e) => setTestCmd(e.target.value)}
                    placeholder="e.g. .ai Explain JavaScript async/await"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button 
                    type="submit" 
                    disabled={testing}
                    className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {testing ? 'Executing...' : 'Run Command'}
                  </button>
                </div>
              </form>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Command Output Simulation</div>
                <pre className="text-sm font-mono text-emerald-300 whitespace-pre-wrap bg-slate-900/80 p-4 rounded-lg border border-slate-800/80 min-h-[120px]">
                  {testOutput || 'Run a command above to see simulated bot output...'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Bot Terminal Logs</h3>
                  <p className="text-sm text-slate-400 mt-1">Real-time log stream from Baileys connection and command execution.</p>
                </div>
                <button 
                  onClick={fetchLogs}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-300 transition-colors"
                >
                  Refresh Logs
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 h-96 overflow-y-auto space-y-1.5">
                {logs.length === 0 ? (
                  <div className="text-slate-500">No logs recorded yet. Start the bot to view logs.</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className={`flex gap-3 ${log.type === 'error' ? 'text-red-400' : 'text-slate-300'}`}>
                      <span className="text-slate-500 shrink-0">[{log.time}]</span>
                      <span className="break-all">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 max-w-2xl">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  Bot & AI Chatbot Configuration
                  <BadgeCheck className="w-5 h-5 text-blue-400 fill-blue-500/20" />
                </h3>
                <p className="text-sm text-slate-400 mt-1">Configure AI providers, models, automatic replies, and verified owners.</p>
              </div>

              {settingsMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg">
                  {settingsMessage}
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Bot Name</label>
                  <input 
                    type="text" 
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Command Prefix (or type "none")</label>
                  <input 
                    type="text" 
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    Verified Owner Numbers (Blue Badge)
                    <BadgeCheck className="w-4 h-4 text-blue-400 fill-blue-500/20" />
                  </label>
                  <input 
                    type="text" 
                    value={ownerNumbers}
                    onChange={(e) => setOwnerNumbers(e.target.value)}
                    placeholder="263786359833,263783549857"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">AI Provider</label>
                    <input 
                      type="text" 
                      value={aiProvider}
                      onChange={(e) => setAiProvider(e.target.value)}
                      placeholder="gemini"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">AI Model</label>
                    <input 
                      type="text" 
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      placeholder="gemini-3.8-flash"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Chatbot Auto-Reply Settings</div>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={chatbotEnabled}
                      onChange={(e) => setChatbotEnabled(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
                    />
                    <span className="text-sm text-slate-200">Enable Automatic Chatbot Replies</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={chatbotGroups}
                      onChange={(e) => setChatbotGroups(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
                    />
                    <span className="text-sm text-slate-200">Respond in Group Chats (`CHATBOT_GROUPS`)</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={chatbotPrivate}
                      onChange={(e) => setChatbotPrivate(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
                    />
                    <span className="text-sm text-slate-200">Respond in Private Chats (`CHATBOT_PRIVATE`)</span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 transition-colors mt-2"
                >
                  Save Configuration
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
