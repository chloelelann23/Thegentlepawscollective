const BREVO_API_URL = 'https://api.brevo.com/v3'

function getHeaders() {
  return {
    'api-key': process.env.BREVO_API_KEY ?? '',
    'Content-Type': 'application/json',
  }
}

export async function subscribeToNewsletter(email: string, name?: string): Promise<boolean> {
  if (!process.env.BREVO_API_KEY) return false

  const res = await fetch(`${BREVO_API_URL}/contacts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      email,
      attributes: name ? { FIRSTNAME: name.split(' ')[0] } : undefined,
      listIds: [Number(process.env.BREVO_LIST_ID ?? 2)],
      updateEnabled: true,
    }),
  })

  return res.ok || res.status === 204
}

export async function unsubscribeFromNewsletter(email: string): Promise<boolean> {
  if (!process.env.BREVO_API_KEY) return false

  const res = await fetch(`${BREVO_API_URL}/contacts/${encodeURIComponent(email)}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ emailBlacklisted: true }),
  })

  return res.ok
}

export async function sendTransactionalEmail({
  to,
  subject,
  htmlContent,
  senderName = 'The Gentle Paws Collective',
  senderEmail = 'hello@thegentlepawscollective.com',
}: {
  to: { email: string; name?: string }[]
  subject: string
  htmlContent: string
  senderName?: string
  senderEmail?: string
}): Promise<boolean> {
  if (!process.env.BREVO_API_KEY) return false

  const res = await fetch(`${BREVO_API_URL}/smtp/email`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to,
      subject,
      htmlContent,
    }),
  })

  return res.ok
}
