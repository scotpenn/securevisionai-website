import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// 简单转义，避免把用户输入原样进 HTML
const esc = (s = '') => String(s).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));

// 限速管理 - 15分钟窗口，每个IP最多5次请求
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15分钟
const MAX_REQUESTS = 5; // 每个窗口最大请求数

function checkRateLimit(clientIP) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // 获取或创建IP记录
  if (!rateLimit.has(clientIP)) {
    rateLimit.set(clientIP, []);
  }
  
  const requests = rateLimit.get(clientIP);
  
  // 清理过期请求
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  rateLimit.set(clientIP, validRequests);
  
  // 检查是否超过限制
  if (validRequests.length >= MAX_REQUESTS) {
    return false; // 超过限制
  }
  
  // 记录当前请求
  validRequests.push(now);
  rateLimit.set(clientIP, validRequests);
  
  return true; // 允许请求
}

// 定期清理过期记录
setInterval(() => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  for (const [ip, requests] of rateLimit.entries()) {
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    if (validRequests.length === 0) {
      rateLimit.delete(ip);
    } else {
      rateLimit.set(ip, validRequests);
    }
  }
}, RATE_LIMIT_WINDOW); // 每15分钟清理一次

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });

  // 获取客户端IP地址
  const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                   req.headers['x-real-ip'] || 
                   req.connection?.remoteAddress || 
                   req.socket?.remoteAddress || 
                   'unknown';

  // 检查限速
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({ 
      ok: false, 
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000 / 60) // 分钟数
    });
  }

  const {
    firstName = '', lastName = '', email = '', phone = '', company = '',
    country = '', message = '', consent, interests = [], hp  // hp 为蜜罐字段
  } = req.body || {};

  // 反机器人：蜜罐命中直接"成功"返回（静默丢弃）
  if (hp) return res.status(200).json({ ok: true });

  // 基础校验
  if (!email || !message || !consent) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${esc(firstName)} ${esc(lastName)}</p>
    <p><strong>Email:</strong> ${esc(email)}</p>
    <p><strong>Phone:</strong> ${esc(phone)}</p>
    <p><strong>Company:</strong> ${esc(company)}</p>
    <p><strong>Country:</strong> ${esc(country)}</p>
    <p><strong>Interests:</strong> ${Array.isArray(interests) ? interests.map(esc).join(', ') : ''}</p>
    <hr />
    <p style="white-space:pre-wrap;">${esc(message)}</p>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'SecureVision AI <noreply@mail.securevisionai.com>',
      to: ['info@securevisionai.com'],        // 接收邮箱
      subject: `Contact: ${firstName} ${lastName}`.trim(),
      html
      // 可选：reply-to 等高级字段后续再加
    });

    if (error) return res.status(500).json({ ok: false, error: String(error?.message || error) });
    return res.status(200).json({ ok: true, id: data?.id || null });

  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message || String(e) });
  }
}