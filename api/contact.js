const MAX_MESSAGE_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

const rateLimitMap = new Map();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress ?? 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  return false;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseBody(req) {
  let body = req.body;

  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return null;
    }
  }

  if (!body || typeof body !== 'object') {
    return null;
  }

  return body;
}

function validateBody(body) {
  const name = body.from_name?.trim();
  const email = body.from_email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return { valid: false, error: 'Todos los campos son requeridos.' };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return { valid: false, error: 'El nombre es demasiado largo.' };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: 'El email no es válido.' };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, error: 'El mensaje es demasiado largo.' };
  }

  return { valid: true };
}

async function sendViaEmailJS(params) {
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;

  if (!privateKey || !publicKey || !serviceId || !templateId) {
    console.error('EmailJS: faltan variables de entorno', {
      hasPrivateKey: !!privateKey,
      hasPublicKey: !!publicKey,
      hasServiceId: !!serviceId,
      hasTemplateId: !!templateId,
    });
    throw new Error('MISSING_ENV');
  }

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: params,
      accessToken: privateKey,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('EmailJS API error:', response.status, errorText);
    throw new Error('EMAILJS_FAILED');
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido.' });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({
      success: false,
      error: 'Demasiados intentos. Inténtalo más tarde.',
    });
  }

  const body = parseBody(req);
  if (!body) {
    return res.status(400).json({ success: false, error: 'Cuerpo de solicitud inválido.' });
  }

  if (body.website?.trim()) {
    return res.status(200).json({ success: true });
  }

  const validation = validateBody(body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, error: validation.error });
  }

  try {
    await sendViaEmailJS({
      from_name: body.from_name.trim(),
      from_email: body.from_email.trim(),
      message: body.message.trim(),
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    if (error.message === 'MISSING_ENV') {
      return res.status(500).json({
        success: false,
        error: 'El servicio de correo no está configurado. Contacta al administrador.',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.',
    });
  }
};
