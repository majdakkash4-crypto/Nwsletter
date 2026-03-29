const https = require('https');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { to, toName, subject, htmlContent } = req.body;
  if (!to || !subject || !htmlContent) return res.status(400).json({ error: 'Missing fields' });

  const payload = JSON.stringify({
    sender: { name: 'Pizza Hood Gescher', email: 'info@pizzahood-gescher.de' },
    to: [{ email: to, name: toName || to }],
    subject,
    htmlContent
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': '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',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          res.status(200).json({ success: true });
        } else {
          console.error('Brevo error:', data);
          res.status(500).json({ error: data });
        }
        resolve();
      });
    });

    request.on('error', (err) => {
      console.error('Request error:', err);
      res.status(500).json({ error: err.message });
      resolve();
    });

    request.write(payload);
    request.end();
  });
};
