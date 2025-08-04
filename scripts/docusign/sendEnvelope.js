const fs = require("fs");
const jwt = require("jsonwebtoken");
const https = require("https");
const http = require("http");
const { URL } = require("url");

function fetchFileAsBase64(fileUrl) {
  return new Promise((resolve, reject) => {
    if (!fileUrl) return reject(new Error("No file URL provided"));

    const urlObj = new URL(fileUrl);
    const lib = urlObj.protocol === "https:" ? https : http;

    lib.get(fileUrl, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch file: ${res.statusCode}`));
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer.toString("base64"));
      });
    }).on("error", reject);
  });
}

function getFileExtension(filename) {
  if (!filename) return null;
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : null;
}

async function getAccessToken() {
  const privateKey = fs.readFileSync(process.env.DOCUSIGN_PRIVATE_KEY_PATH);

  const jwtPayload = {
    iss: process.env.DOCUSIGN_INTEGRATOR_KEY,
    sub: process.env.DOCUSIGN_USER_ID,
    aud: `${process.env.DOCUSIGN_OAUTH_BASE_PATH}`,
    scope: "signature",
  };

  const token = jwt.sign(jwtPayload, privateKey, {
    algorithm: "RS256",
    expiresIn: "10m",
    header: {
      kid: process.env.DOCUSIGN_INTEGRATOR_KEY,
      alg: "RS256",
    },
  });

  const postData = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: token,
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: process.env.DOCUSIGN_OAUTH_BASE_PATH,
      path: "/oauth/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.toString().length,
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(body);
          if (json.access_token) {
            resolve(json.access_token);
          } else {
            reject(new Error(`Token error: ${body}`));
          }
        } catch (e) {
          reject(new Error(`Token response not JSON: ${body}`));
        }
      });
    });

    req.on("error", reject);
    req.write(postData.toString());
    req.end();
  });
}

/**
 * Sends a DocuSign envelope.
 * @param {string} signerName
 * @param {string} signerEmail
 * @param {string} fileUrl
 * @param {string} documentName
 * @param {string} [fileExtension]
 */
async function sendEnvelope(signerName, signerEmail, fileUrl, documentName, fileExtension) {
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

  try {
    const accessToken = await getAccessToken();
    console.log("✅ Access Token retrieved");

    const documentBase64 = await fetchFileAsBase64(fileUrl);
    const extension =
      fileExtension ||
      getFileExtension(documentName) ||
      getFileExtension(fileUrl) ||
      "pdf";

    const envelopeDefinition = {
      emailSubject: "Please sign this document",
      documents: [
        {
          documentBase64,
          name: documentName || `Document.${extension}`,
          fileExtension: extension,
          documentId: "1",
        },
      ],
      recipients: {
        signers: [
          {
            email: signerEmail,
            name: signerName,
            recipientId: "1",
            routingOrder: "1",
            tabs: {
              signHereTabs: [
                {
                  anchorString: "/sig1/",
                  anchorYOffset: "0",
                  anchorUnits: "pixels",
                  anchorXOffset: "0",
                },
              ],
            },
          },
        ],
      },
      status: "sent",
    };

    const postData = JSON.stringify(envelopeDefinition);

    return new Promise((resolve, reject) => {
      const options = {
        hostname: "demo.docusign.net",
        path: `/restapi/v2.1/accounts/${accountId}/envelopes`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(body);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              console.log("✅ Envelope sent:", json.envelopeId);
              resolve(json);
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
      req.write(postData);
      req.end();
    });
  } catch (err) {
    console.error("❌ DocuSign Error:", err);
    throw new Error(err.message || "DocuSign failed unexpectedly.");
  }
}

module.exports = { sendEnvelope };
