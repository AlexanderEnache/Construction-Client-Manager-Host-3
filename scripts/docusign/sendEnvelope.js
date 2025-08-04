const fs = require("fs");
const jwt = require("jsonwebtoken");
const https = require("https");
const http = require("http");
const { URL } = require("url");

// ✅ Helper: Fetch file and convert to base64
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

// ✅ Helper: Extract extension
function getFileExtension(filename) {
  if (!filename) return null;
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : null;
}

// ✅ Generate JWT token for DocuSign API
async function getAccessToken() {
  const privateKey = "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAnyXtaeLx3ITEVYUj8D3rHHMAvXUFvqsFdMT3Y/fGSt01+PeR\n6o40xANFxHn2kI+qqXTxumsfw5LExoRFswYjxU2P2Pm319yqMZGjBohkoMX1bzZG\njqwWO+gumqIM5J6DCLoqyOkHQeMH83LgTN+vGc+KuEArovUQqh5+m9O7X7pMiYiM\nQyBvrzpp9ZalNm5VZJkj2F1Pqp2S1skcPyWlDwlWfCd+owbA3nKsreMz1GDp3+Mp\nkpWNKjqgMazUVxae2e2AUqQnsbBx1vu77uORns1ichWSDHE/OmlNbdJ7vS7sj8/h\nGMJzr47Zr4zJCYzieIn7y/J7tqSPEMg6X6y1aQIDAQABAoIBAA7fODWkJcZd6Mv2\nFmLpolok/A14TUphSG/+RQEEQzU1QUkr92iEE/W6OY+P9yTQrBnMSheJ0azQvw8v\nBqVhXj/ejOHxigbDwerCaYnffonQnewf1g2YkrZT7uD34j0N/AA5h2yBbDJxwQk0\ns7WzVHVUwemQY5OFk6JWGa49pb2e8J/OZR4KMhxIym4gDdzd91JTNw9ulxi3DcEf\nmnTh2U7RgnDFAHK6fy+ZDoQWP/DG2daV3o6diSSZm+ayrlqxYRpeNAQMMGQoGfQF\nAeIVETZ9eqLTtHxg0+GmPCg/1WpTlHQiQXR3XKkgWU3E9smTn3oXG5hMoo48om18\nsUPO41UCgYEA8JdJ0fcUoGJtsb2jCtkakAdIwiCmdheV6YLYgsfLyE7UVMW0/+9o\nYaTv/PJuRPhX05SoJKMbFuAtDvpndDxoz4YNZvRqCi01gMD2bAn1k1MBHArPlOeG\n1RSEdb0T42DAeP5fMTRIccPB0ufP6jEoUDhr1usOIIlcyPAaxXdKoDUCgYEAqVdP\nBdrrYFcI3MGVB1UsOCNS77Wo4xz05OBjBsbKpN3EnSCyi8E81TRBGze1roQi+l+Z\nkThq1ABjl/7oyK9rDTwuq0OcsfWddFC4tI7Pp4PFn5Vlo9qMiiB0dUVA5yuTodfo\ncX7C7JJbUfRWt4JBT1QbBardcbPZ0eO6BI6WjuUCgYBmKniIlvnFWcbnMXZpBuSG\nwPEerqrBfyaD8LJsZtecig0UqphADrQustHOgkxdMXBqQrhcRn8cabn4oFEKRRTk\n+zH5xFS7WZNcx5RdMKV+GENiWxznSKIzHfFZ5h7p8Y4KU0qtJFyXIt/N5e6erp1F\n44+3xj1Lh8lE8uELdarU+QKBgQCHY3uVldLsAoneXZM1+p3RAET1y8qMUgFl4BSs\nPVGVAI2KhrLZU5S8bPvEtAS404JXpQlVdsLKXslBo5cfpEg1m7FAUl08VsAdV9Bk\n420YZB0jmsFZgIkuggY6IDVk3Y06LzHzU8Kqe9UxL+YI78Yhk3/LRzGnD4EN80Et\nFYdAFQKBgQDfC31+rJH5p1XSK+L7g1eVub9ctQYerbjVt7VN+O3fYRGrqoNfk+AP\n+DydGhMpa37ht3RHHSjKE44jEwRMHDiijl7s7oShZ5jOkb8M4m7dPK81G21vUwK0\nGr1qJHDiXxVrJCKet6f0ArdHJZaO6O/bZlQtNRgD3FZQsjTT5WIJUA==\n-----END RSA PRIVATE KEY-----";

  if (!privateKey) throw new Error("Private key not found in environment variables.");

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

// ✅ MAIN: Sends a DocuSign envelope with webhook support
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

      // ✅ ADDED: Webhook support
      eventNotification: {
        url: `${process.env.DOCUSIGN_WEBHOOK_URL}`, // e.g., https://yourdomain.com/api/docusign-webhook
        loggingEnabled: true,
        requireAcknowledgment: true,
        useSoapInterface: false,
        includeDocuments: false,
        includeEnvelopeVoidReason: true,
        includeTimeZone: true,
        includeSenderAccountAsCustomField: true,
        includeDocumentFields: true,
        includeCertificateOfCompletion: false,
        envelopeEvents: [
          { envelopeEventStatusCode: "sent", includeDocuments: false },
          { envelopeEventStatusCode: "delivered", includeDocuments: false },
          { envelopeEventStatusCode: "completed", includeDocuments: false },
          { envelopeEventStatusCode: "declined", includeDocuments: false },
          { envelopeEventStatusCode: "voided", includeDocuments: false },
        ],
      },
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
              resolve(json); // Includes envelopeId
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
