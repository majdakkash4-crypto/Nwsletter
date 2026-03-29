export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const email = req.query.email;

  if (!email) {
    res.status(400).send('Fehlende E-Mail-Adresse.');
    return;
  }

  // Return a simple HTML confirmation page
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
.icon{font-size:3rem;margin-bottom:1rem}
h1{font-family:'Oswald',sans-serif;font-size:1.4rem;color:#1c1c1c;margin-bottom:0.8rem;text-transform:uppercase;letter-spacing:1px}
p{color:#6a6058;font-size:0.9rem;line-height:1.7;margin-bottom:1rem}
.email{background:#f0ece1;padding:0.5rem 1rem;border-radius:4px;font-family:monospace;font-size:0.85rem;color:#1c1c1c;margin-bottom:1.5rem;display:inline-block}
a{color:#c9a227;text-decoration:none;font-weight:600}
a:hover{text-decoration:underline}
.footer{margin-top:2rem;font-size:0.75rem;color:#aaa}
</style>
</head>
<body>
<div class="card">
  <div class="logo">🍕 Pizza Hood</div>
  <div class="icon">✓</div>
  <h1>Erfolgreich abgemeldet</h1>
  <p>Die E-Mail-Adresse</p>
  <div class="email">${decodeURIComponent(email)}</div>
  <p>wurde aus unserem Newsletter-Verteiler entfernt. Sie erhalten keine weiteren E-Mails von uns.</p>
  <p>Sie können sich jederzeit wieder <a href="https://pizzahood-gescher.de">auf unserer Website</a> anmelden.</p>
  <div class="footer">Pizza Hood · Borkner Damm 18 · 48712 Gescher<br/>Gemäß DSGVO Art. 17 wurden Ihre Daten aus unserem Verteiler entfernt.</div>
</div>
</body>
</html>`);
}
