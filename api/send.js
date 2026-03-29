const https = require('https');

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  // Parse body
  const to = (req.body || {}).to;
  const toName = (req.body || {}).toName || to;
  const subject = (req.body || {}).subject;
  const htmlContent = (req.body || {}).htmlContent;

  if (!to || !subject) {
    res.status(400).json({ error: 'Missing to or subject', body: req.body });
    return;
  }

  const payload = JSON.stringify({
    sender: { name: 'Pizza Hood Gescher', email: 'info@pizzahood-gescher.de' },
    to: [{ email: to, name: toName }],
    subject: subject,
    htmlContent: htmlContent || '<p>Test</p>'
  });

  const req2 = https.request({
    hostname: 'api.brevo.com',
    port: 443,
    path: '/v3/smtp/email',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': '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',
      'Content-Length': Buffer.byteLength(payload)
    }
  }, function(r) {
    let d = '';
    r.on('data', function(c) { d += c; });
    r.on('end', function() {
      if (r.statusCode >= 200 && r.statusCode < 300) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ brevoStatus: r.statusCode, brevoError: d });
      }
    });
  });

  req2.on('error', function(e) {
    res.status(500).json({ httpsError: e.message });
  });

  req2.write(payload);
  req2.end();
};
