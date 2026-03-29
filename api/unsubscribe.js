import https from 'https';

export default function handler(req, res) {
  const email = req.query.email;

  if (!email) {
    res.status(400).send('Fehlende E-Mail-Adresse.');
    return;
  }

  const decoded = decodeURIComponent(email);

  // Notify admin via Brevo
  const payload = JSON.stringify({
    sender: { name: 'Pizza Hood System', email: 'suherato1@hotmail.de' },
    to: [{ email: 'suherato1@hotmail.de', name: 'Pizza Hood Admin' }],
    subject: 'Abmeldung: ' + decoded,
    htmlContent: '<p>Der Abonnent <strong>' + decoded + '</strong> hat sich vom Newsletter abgemeldet.</p><p>Bitte entferne diese E-Mail-Adresse manuell aus dem System unter: DSGVO &rarr; Abonnent loeschen.</p>'
  });

  const req2 = https.request({
    hostname: 'api.brevo.com',
    port: 443,
    path: '/v3/smtp/email',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'Content-Length': Buffer.byteLength(payload)
    }
  }, function(r) {
    let d = '';
    r.on('data', function(c) { d += c; });
    r.on('end', function() {
      console.log('Admin notification sent:', r.statusCode, d);
    });
  });
  req2.on('error', function(e) { console.error(e); });
  req2.write(payload);
  req2.end();

  // Show confirmation page
  res.status(200).send(`<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Abgemeldet — Pizza Hood</title>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Open+Sans:wght@400;500&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#f8f6f1;font-family:'Open Sans',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center}
.card{background:#fff;border-radius:8px;padding:3rem 2.5rem;max-width:480px;width:90%;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,0.08);border-top:4px solid #c9a227}
.logo{font-family:'Oswald',sans-serif;font-size:1.8rem;font-weight:700;color:#c9a227;margin-bottom:0.5rem}
.icon{font-size:3rem;margin:1rem 0}
h1{font-family:'Oswald',sans-serif;font-size:1.4rem;color:#1c1c1c;margin-bottom:0.8rem;text-transform:uppercase;letter-spacing:1px}
p{color:#6a6058;font-size:0.9rem;line-height:1.7;margin-bottom:0.8rem}
.email{background:#f0ece1;padding:0.5rem 1rem;border-radius:4px;font-family:monospace;font-size:0.85rem;color:#1c1c1c;display:inline-block;margin:0.5rem 0 1rem}
a{color:#c9a227;font-weight:600;text-decoration:none}
.footer{margin-top:2rem;font-size:0.72rem;color:#bbb;line-height:1.8}
</style>
</head>
<body>
<div class="card">
  <div class="logo">&#127829; Pizza Hood</div>
  <div class="icon">&#10003;</div>
  <h1>Erfolgreich abgemeldet</h1>
  <p>Die E-Mail-Adresse</p>
  <div class="email">${decoded}</div>
  <p>wurde aus unserem Newsletter-Verteiler entfernt. Sie erhalten keine weiteren E-Mails von uns.</p>
  <p>Sie k&#246;nnen uns jederzeit wieder auf <a href="https://pizzahood-gescher.de">pizzahood-gescher.de</a> besuchen.</p>
  <div class="footer">Pizza Hood &middot; Borkner Damm 18 &middot; 48712 Gescher<br/>Gem&#228;&#223; DSGVO Art. 17 wurden Ihre Daten aus unserem Verteiler entfernt.</div>
</div>
</body>
</html>`);
}
