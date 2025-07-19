import os from 'os';
import app from './app';

const PORT = parseInt(process.env.PORT || '4000', 10);

console.log('🧪 OPENAI_API_KEY starts with:', process.env.OPENAI_API_KEY?.slice(0, 8) || 'undefined');

app.listen(PORT, '0.0.0.0', () => {
  const interfaces = os.networkInterfaces();
  let localIp = 'localhost';

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIp = iface.address;
        break;
      }
    }
  }

  console.log(`✅ Server running at:`);
  console.log(`   • http://localhost:${PORT}`);
  console.log(`   • http://${localIp}:${PORT} (use this on your phone)`);
});
