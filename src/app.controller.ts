import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('reset-password')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getResetPasswordPage(): string {
    return `
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Réinitialiser le mot de passe</title>
    <link rel="stylesheet" href="/reset-password.css" />
  </head>
  <body>
    <main class="card">
      <h1>Réinitialiser votre mot de passe</h1>
      <p>Choisissez un nouveau mot de passe et validez.</p>
      <form id="reset-form">
        <label for="newPassword">Nouveau mot de passe</label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          minlength="12"
          pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{12,}"
          title="Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
          required
        />
        <button type="submit">Réinitialiser</button>
      </form>
      <div id="message"></div>
    </main>
    <script src="/reset-password.js" defer></script>
  </body>
</html>
    `;
  }

  @Get('reset-password.css')
  @Header('Content-Type', 'text/css; charset=utf-8')
  getResetPasswordCss(): string {
    return `
body {
  font-family: Arial, sans-serif;
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f5f5f5;
}

.card {
  width: min(92vw, 420px);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
  padding: 24px;
}

h1 {
  margin: 0 0 12px;
  font-size: 1.35rem;
}

p {
  margin: 0 0 16px;
  color: #555;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 12px;
}

button {
  width: 100%;
  border: 0;
  border-radius: 8px;
  padding: 10px 14px;
  background: #111;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.ok {
  color: #0f766e;
  margin-top: 12px;
}

.err {
  color: #b91c1c;
  margin-top: 12px;
}
    `;
  }

  @Get('reset-password.js')
  @Header('Content-Type', 'application/javascript; charset=utf-8')
  getResetPasswordJs(): string {
    return `
const form = document.getElementById('reset-form');
const message = document.getElementById('message');
const passwordInput = document.getElementById('newPassword');
const params = new URLSearchParams(window.location.search);
const token = params.get('token');

const passwordPolicyMessage =
  'Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.';

if (!token) {
  message.className = 'err';
  message.textContent = 'Token manquant dans le lien.';
}

passwordInput.addEventListener('invalid', () => {
  passwordInput.setCustomValidity(passwordPolicyMessage);
});

passwordInput.addEventListener('input', () => {
  passwordInput.setCustomValidity('');
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.className = '';
  message.textContent = '';

  if (!token) {
    message.className = 'err';
    message.textContent = 'Token manquant dans le lien.';
    return;
  }

  const newPassword = passwordInput.value;

  try {
    const response = await fetch('/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || 'Échec de la réinitialisation.');
    }

    message.className = 'ok';
    message.textContent =
      payload.message || 'Mot de passe réinitialisé avec succès.';
    form.reset();
  } catch (error) {
    message.className = 'err';
    message.textContent = error.message || 'Échec de la réinitialisation.';
  }
});
    `;
  }
}
