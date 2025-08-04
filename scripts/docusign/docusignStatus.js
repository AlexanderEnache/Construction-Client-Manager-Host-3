const https = require("https");
const { getAccessToken } = require("./sendEnvelope"); // Reuse your existing token function

/**
 * Get the current status of a DocuSign envelope by envelopeId
 * @param {string} envelopeId - The DocuSign envelope ID
 * @returns {Promise<string>} - Resolves with envelope status (e.g., "sent", "completed")
 */
async function getEnvelopeStatus(envelopeId) {
  if (!envelopeId) {
    throw new Error("Envelope ID is required");
  }

  const accessToken = await getAccessToken();
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

  return new Promise((resolve, reject) => {
    const options = {
      hostname: "demo.docusign.net",
      path: `/restapi/v2.1/accounts/${accountId}/envelopes/${envelopeId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json.status); // e.g., "sent", "completed"
          } else {
            const errorMsg = json.message || json.error || body;
            reject(new Error(`DocuSign API error ${res.statusCode}: ${errorMsg}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse DocuSign response: ${body}`));
        }
      });
    });

    req.on("error", reject);
    req.end();
  });
}

module.exports = { getEnvelopeStatus };
