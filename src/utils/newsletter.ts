export function isNewsletterConfigured() {
  return Boolean(
    process.env.NEWSLETTER_BASE_URL &&
      process.env.NEWSLETTER_PORTAL_ID &&
      process.env.NEWSLETTER_FORM_ID
  );
}

export async function signUpForNewsletter(
  data: Record<string, string>
): Promise<Response> {
  if (!isNewsletterConfigured()) {
    throw new Error('Newsletter is not configured');
  }

  const proxyURl = `${process.env.NEWSLETTER_BASE_URL}/v1/hs/forms/${process.env.NEWSLETTER_PORTAL_ID}/${process.env.NEWSLETTER_FORM_ID}`;

  const headers = {
    Accept: '*',
    'Content-Type': 'application/json',
  };
  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  };

  return fetch(proxyURl, requestOptions);
}
