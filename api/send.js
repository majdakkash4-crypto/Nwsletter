module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { to, toName, subject, htmlContent } = req.body;
  if (!to || !subject || !htmlContent) return res.status(400).json({ error: 'Missing fields' });

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': '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'
      },
      body: JSON.stringify({
        sender: { name: 'Pizza Hood Gescher', email: 'info@pizzahood-gescher.de' },
        to: [{ email: to, name: toName || to }],
        subject,
        htmlContent
      })
    });

    const text = await response.text();
    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      console.error('Brevo error:', text);
      return res.status(500).json({ error: text });
    }
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: err.message });
  }
};
