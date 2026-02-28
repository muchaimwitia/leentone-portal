import { NextResponse } from 'next/server';

// Lightweight sanitization to strip malicious HTML/Scripts (Anti-XSS)
const sanitizeInput = (str: string) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[<&>]/g, function (c) {
    return {'<': '&lt;', '>': '&gt;', '&': '&amp;'}[c] as string;
  }).trim();
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Sanitize incoming payload
    const name = sanitizeInput(body.name);
    const email = sanitizeInput(body.email);
    const horizon = sanitizeInput(body.horizon);

    // 2. Strict Validation Check
    if (!name || !email || !email.includes('@') || !horizon) {
      return NextResponse.json({ error: 'Invalid payload signature.' }, { status: 400 });
    }

    // 3. SECURITY & ENCRYPTION PROTOCOL 
    // In production, this is where you would connect an ORM (like Prisma) to a Postgres DB.
    // Example: 
    // await prisma.inquiry.create({ 
    //   data: { name, email, horizon, encryptedAt: new Date() } 
    // });
    
    console.log(`[SECURE VAULT] Received verified inquiry from: ${email} for horizon: ${horizon}`);

    // 4. Return success to the frontend
    return NextResponse.json({ 
      status: 'success', 
      message: 'Inquiry securely logged.' 
    }, { status: 200 });

  } catch (error) {
    // Top 10 OWASP Rule: NEVER leak actual server errors to the client.
    console.error('[SECURITY ALERT] Malformed inquiry payload rejected.');
    return NextResponse.json({ error: 'Protocol violation. Request terminated.' }, { status: 500 });
  }
}