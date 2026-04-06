type SendEmailParams = {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  textContent: string;
};

export async function sendBrevoEmail(params: SendEmailParams) {
  if (!process.env.BREVO_API_KEY || !process.env.BREVO_FROM_EMAIL) {
    console.warn("Brevo non configuré. Email ignoré.");
    return;
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        email: process.env.BREVO_FROM_EMAIL,
        name: "CODE VIVANT · Philippe Malbrunot",
      },
      to: [
        {
          email: params.to,
          name: params.toName || params.to,
        },
      ],
      subject: params.subject,
      htmlContent: params.htmlContent,
      textContent: params.textContent,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Brevo a refusé l'envoi: ${detail}`);
  }
}
