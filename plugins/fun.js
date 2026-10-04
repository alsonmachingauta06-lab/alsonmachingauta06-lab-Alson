export default {
  name: ['muth', '8ball', 'compliment', 'lovetest', 'ship', 'quote', 'joke', 'fact', 'truth', 'dare', 'wyr', 'horoscope', 'rate', 'dice', 'coin', 'rizz', 'sigma', 'vibe'],
  description: 'Fun & interactive entertainment commands powered by ALSON-XMD',
  category: 'Fun',
  usage: 'muth | 8ball <question> | compliment | lovetest <name1> <name2> | ship <name1> <name2> | quote | joke | fact | truth | dare | wyr | horoscope <sign> | rate <item> | dice | coin | rizz | sigma | vibe',
  async execute({ sock, msg, args, commandName, config }) {
    const text = args.join(' ');
    let replyText = '';

    switch (commandName) {
      case 'muth':
        replyText = `🎲 *ALSON-XMD Mutha*\n\nYour lucky number today is: *${Math.floor(Math.random() * 100) + 1}*!`;
        break;
      case '8ball':
        const answers = [
          'Yes, definitely.', 'It is decidedly so.', 'Without a doubt.', 'Reply hazy, try again.',
          'Ask again later.', 'Better not tell you now.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful.'
        ];
        replyText = `🎱 *Magic 8-Ball*\n\nQuestion: "${text || 'Will success be mine?'}"\nAnswer: *${answers[Math.floor(Math.random() * answers.length)]}*`;
        break;
      case 'compliment':
        const comps = [
          'You bring great energy wherever you go!',
          'Your kindness and intelligence are truly inspiring.',
          'You have an incredible eye for detail.',
          'The world is a better place with you in it!'
        ];
        replyText = `✨ *ALSON-XMD Compliment*\n\n${comps[Math.floor(Math.random() * comps.length)]}`;
        break;
      case 'lovetest':
        const score = Math.floor(Math.random() * 51) + 50; // 50-100%
        replyText = `❤️ *Love Compatibility Test*\n\nNames: ${text || 'You & Me'}\nCompatibility Score: *${score}%* ${score > 80 ? '💖 Perfect Match!' : '💞 Great Chemistry!'}`;
        break;
      case 'ship':
        const shipScore = Math.floor(Math.random() * 101);
        replyText = `🚢 *Love Ship Calculator*\n\nPair: ${text || 'Mystery Couple'}\nShip Rating: *${shipScore}%* ${shipScore > 75 ? '🔥 Destined together!' : '💛 Good potential!'}`;
        break;
      case 'quote':
        const quotes = [
          '“The best way to predict the future is to invent it.” – Alan Kay',
          '“Code is like humor. When you have to explain it, it’s bad.” – Cory House',
          '“Simplicity is the soul of efficiency.” – Austin Freeman',
          '“Talk is cheap. Show me the code.” – Linus Torvalds'
        ];
        replyText = `📜 *ALSON-XMD Quote*\n\n${quotes[Math.floor(Math.random() * quotes.length)]}`;
        break;
      case 'joke':
        const jokes = [
          'Why do programmers prefer dark mode? Because light attracts bugs!',
          'There are 10 types of people in the world: those who understand binary, and those who don’t.',
          'Why did the JavaScript developer wear glasses? Because they didn’t C#.'
        ];
        replyText = `😂 *ALSON-XMD Joke*\n\n${jokes[Math.floor(Math.random() * jokes.length)]}`;
        break;
      case 'fact':
        const facts = [
          'Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old.',
          'Octopuses have three hearts and blue blood.',
          'Bananas are curved because they grow towards the sun against gravity.'
        ];
        replyText = `🧠 *Did You Know?*\n\n${facts[Math.floor(Math.random() * facts.length)]}`;
        break;
      case 'truth':
        const truths = [
          'What is your most embarrassing childhood memory?',
          'If you could swap lives with anyone for one day, who would it be?',
          'What is a secret you have never told anyone?'
        ];
        replyText = `🔍 *Truth Challenge*\n\n${truths[Math.floor(Math.random() * truths.length)]}`;
        break;
      case 'dare':
        const dares = [
          'Send a voice note singing your favorite song.',
          'Text your best friend saying "I know your biggest secret."',
          'Do 20 pushups right now and send proof.'
        ];
        replyText = `⚡ *Dare Challenge*\n\n${dares[Math.floor(Math.random() * dares.length)]}`;
        break;
      case 'wyr':
        const wyrs = [
          'Would you rather be able to fly or be invisible?',
          'Would you rather always be 10 minutes late or 20 minutes early?',
          'Would you rather live without internet or without air conditioning?'
        ];
        replyText = `🤔 *Would You Rather*\n\n${wyrs[Math.floor(Math.random() * wyrs.length)]}`;
        break;
      case 'horoscope':
        const sign = text || 'General';
        replyText = `🔮 *Horoscope for ${sign}*\n\nToday brings unexpected clarity and creative opportunities. Stay focused and trust your intuition.`;
        break;
      case 'rate':
        const rating = Math.floor(Math.random() * 11);
        replyText = `⭐ *ALSON-XMD Rating*\n\nSubject: ${text || 'Everything'}\nRating: *${rating}/10*`;
        break;
      case 'dice':
        const roll = Math.floor(Math.random() * 6) + 1;
        replyText = `🎲 *Dice Roll*\n\nYou rolled a: *${roll}* 🎯`;
        break;
      case 'coin':
        const flip = Math.random() < 0.5 ? 'Heads 🪙' : 'Tails 🪙';
        replyText = `🪙 *Coin Flip*\n\nResult: *${flip}*`;
        break;
      case 'rizz':
        const rizzes = [
          'Are you a Wi-Fi signal? Because I’m feeling a strong connection.',
          'Are you a keyboard? Because you’re my type.',
          'Do you have a map? I keep getting lost in your eyes.'
        ];
        replyText = `😎 *ALSON-XMD Rizz*\n\n${rizzes[Math.floor(Math.random() * rizzes.length)]}`;
        break;
      case 'sigma':
        replyText = `🗿 *Sigma Grindset*\n\n"Focus on yourself. Success is the best revenge." — ALSON-XMD Sigma`;
        break;
      case 'vibe':
        const vibes = ['100% Immaculate Vibe ✨', 'Chill & Relaxed 🌊', 'Unstoppable Energy ⚡', 'Mysterious & Cool 🕶️'];
        replyText = `🎧 *Vibe Check*\n\nYour current vibe is: *${vibes[Math.floor(Math.random() * vibes.length)]}*`;
        break;
      default:
        replyText = `🎮 ALSON-XMD Entertainment System`;
    }

    await sock.sendMessage(msg.key.remoteJid, { text: replyText }, { quoted: msg });
  }
};
