import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// 简单转义，避免把用户输入原样进 HTML
const esc = (s = '') => String(s).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });

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