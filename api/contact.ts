import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ContactBody {
  from_name?: string;
  from_email?: string;
  message?: string;
  website?: string;
}

const MAX_MESSAGE_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress ?? 'unknown';
}

function isRateLimited(ip: string): boolean {
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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateBody(body: ContactBody): { valid: boolean; error?: string } {
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

async function sendViaEmailJS(params: {
  from_name: string;
  from_email: string;
  message: string;
}): Promise<void> {
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;

  if (!privateKey || !publicKey || !serviceId || !templateId) {
    throw new Error('Configuración de EmailJS incompleta.');
  }

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: publicKey,
      service_id: serviceId,
      template_id: templateId,
      template_params: params,
      accessToken: privateKey,
    }),
  });

  if (!response.ok) {
    throw new Error('Error al enviar el correo.');
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  const body = req.body as ContactBody;

  if (body.website?.trim()) {
    return res.status(200).json({ success: true });
  }

  const validation = validateBody(body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, error: validation.error });
  }

  try {
    await sendViaEmailJS({
      from_name: body.from_name!.trim(),
      from_email: body.from_email!.trim(),
      message: body.message!.trim(),
    });
    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({
      success: false,
      error: 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.',
    });
  }
}
