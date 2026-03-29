const https = require('https');

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).end(); return; }

  // Collect raw body manually in case auto-parsing fails
  let rawBody = '';
  req.on('data', function(chunk) { rawBody += chunk.toString(); });
  req.on('end', function() {
    let body;
    try {
      // Try req.body first (Vercel auto-parses), fallback to rawBody
      body = (req.body && req.body.to) ? req.body : JSON.parse(rawBody);
    } catch(e) {
      res.status(400).json({ error: 'Invalid JSON: ' + e.message });
      return;
    }

    const to = body.to;
    const toName = body.toName || to;
    const subject = body.subject;
    const htmlContent = body.htmlContent;

    if (!to || !subject || !htmlContent) {
      res.status(400).json({ error: 'Missing: to=' + to + ' subject=' + subject });
      return;
    }

    const payload = JSON.stringify({
      sender: { name: 'Pizza Hood Gescher', email: 'info@pizzahood-gescher.de' },
      to: [{ email: to, name: toName }],
      subject: subject,
      htmlContent: htmlContent
    });

    const options = {
      hostname: 'api.brevo.com',
      port: 443,
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': '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',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const request = https.request(options, function(response) {
      let data = '';
      response.on('data', function(chunk) { data += chunk; });
      response.on('end', function() {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          res.status(200).json({ success: true });
        } else {
          res.status(500).json({ error: 'Brevo ' + response.statusCode + ': ' + data });
        }
      });
    });

    request.on('error', function(err) {
      res.status(500).json({ error: 'https error: ' + err.message });
    });

    request.write(payload);
    request.end();
  });
};
