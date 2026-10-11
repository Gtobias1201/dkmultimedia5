// Formulario de contacto: validación nativa + envío sin recargar la página.
// El endpoint es el `action` del formulario (send_mail.php, como en el sitio original).

const form = document.querySelector('.formulario form');
const status = form?.querySelector('.form-status');

function say(msg, state = '') {
  status.textContent = msg;
  status.dataset.state = state;
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    const bad = form.querySelector(':invalid');
    say(bad?.type === 'email' ? 'Revisá tu email.' : 'Escribí tu mensaje antes de enviar.', 'error');
    bad?.focus();
    return;
  }
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  say('Enviando…');
  try {
    const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(res.status);
    form.reset();
    say('¡Gracias! Tu mensaje fue enviado.');
  } catch {
    say('No se pudo enviar el mensaje. Probá de nuevo más tarde o escribime por LinkedIn.', 'error');
  } finally {
    btn.disabled = false;
  }
});
