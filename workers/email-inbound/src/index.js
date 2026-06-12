import PostalMime from "postal-mime";

export default {
  /**
   * Cloudflare Email Worker — fires when an email arrives at
   * audit-{uuid}@mail.beyondopenrate.com.au
   *
   * Parses the raw email, extracts what the audit runner needs,
   * and POSTs it to the Next.js inbound webhook.
   */
  async email(message, env, ctx) {
    // Convert ReadableStream to ArrayBuffer before parsing
    const rawBuffer = await new Response(message.raw).arrayBuffer();
    const email = await new PostalMime().parse(rawBuffer);

    // Build a flat headers map (lowercase keys, arrays for multi-value)
    const headers = {};
    for (const { key, value } of email.headers) {
      const k = key.toLowerCase();
      if (k in headers) {
        headers[k] = Array.isArray(headers[k])
          ? [...headers[k], value]
          : [headers[k], value];
      } else {
        headers[k] = value;
      }
    }

    // Extract sending IP from the outermost Received header.
    // Cloudflare adds the first Received header (index 0 after parse),
    // which shows the IP that connected to Cloudflare's mail server —
    // this is the ESP's real outbound IP, which can't be forged.
    const receivedHeaders = Array.isArray(headers["received"])
      ? headers["received"]
      : headers["received"]
      ? [headers["received"]]
      : [];

    const sendingIp = extractIp(receivedHeaders[0] ?? "");

    const body = {
      to: message.to.toLowerCase(),
      from: message.from,
      subject: email.subject ?? "",
      sending_ip: sendingIp,
      headers,
      html: email.html ?? null,
      text: email.text ?? null,
    };

    const res = await fetch(env.INBOUND_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-worker-secret": env.WORKER_SECRET,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`Inbound webhook failed: ${res.status} ${text}`);
    }
  },
};

/**
 * Extract the first IPv4 address from a Received header.
 * e.g. "from mail.klaviyo.com (mail.klaviyo.com [45.56.123.45]) by ..."
 *      → "45.56.123.45"
 */
function extractIp(received) {
  const match = received.match(/\[(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\]/);
  return match ? match[1] : null;
}
