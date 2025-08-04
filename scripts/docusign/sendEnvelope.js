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
  const privateKey = "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAk3WRt6nZp9YZ/zWBGBp1JzcSJUaZG7sFgBJCxdSIykoqk3Od\nXpg4n46ebITVGh3Hmsaq2o5+UQkAS3VLZLxBmy0RyyFnl2ZD0avogWcFtDhC9lGH\nUxTAUPsOpNQfzZwbHbkbyKXsy6ptgS6VlnqPFnjK4DQsWlshcnicK2p125xfkZoE\nM1KIU7TgKoj/kqAJpVxM4v5OCT3m1GlS4bqi5eAYGGE5JLizVIn2QH4rDFnj3KF3\nUAnIMdrH1yVRaJ7+6r0dKFPlYt5G0aP8qZCQrRQyAUhTPfkRMNyczSPdSgZKs2zg\nOVY/BnlO03Lv7PbxWfPjwxXPxTp++0TwtsSuAwIDAQABAoIBAAN7p3F7JZT9Tafl\nj6MOHO5MMrWGsV8iT8Lyq3kYyBJfJhpNhM4TMmMybzOI/6+aPHi/cJGxA/LOD5+4\nqYs7lyEfM2hk5ZmB5OAy+07zLANRwOMokdW4i8Jd676g9A9bPJi7IpjesnUtFWET\nxJzFUFPrjn81PEb2GBgoGSg9X4NMaRcr33mm/bd/WUE46rBSCt4sEnazbrf5DuHq\nzk/mwFbghNnlfy3jh/Hg94AE8eCkg9cIWOh5BNTdCNyHfqldQ66biyaX7Es1z9xA\nkwNEctaKe11ERrCgeNdoSIF2UghK1xJOB5wOFx5hluZQPQecNa2/Q/s6OEmTB9+E\nf0Gq6yECgYEAxq3olJO7sOABKI4owIhCWHq+9OSFYpB47yz80MqiuD5/0ga2PjHu\nYviuw3HsvIllqYJLVrqIq7C/Nio6zuGYBl2PwmbbWWXoKNxePaPh7itCMG4mE+rB\nHWVFnTX5YzTIzL02xWpl1LCv3NpqG3gJKcpdyfascrhaOz6pU0D4/2cCgYEAvgCj\nxLRZbTNcRmZvebWSvwW++ZpFv+lC12j2uTVYtCRB48SLtkEPd9DKbtcYEFDyKePl\nrqutN1CCekOtySpt/d1YuP8kuHOu1DC8RqfWo1XxcWjbeWM7rbJEU0/rDnzzgmcl\nQCtEj/Zp+kHxH+SEY1nZSaz1BRrhWSUQPdipJwUCgYBo977WqMrUIzVZeOoc9qCe\n4JL9DbNPJOdP7iPQKA8aaqLbkwI8D+NT1PF4fztFTQ4yJY2qT7kfhK0xb9RMMzI/\nwrTOT8t6CvZCiFMeG/SlAaPhtIBXq4LGBhhme/q7qEqiqSFD4ffVDFiNxbOjuaKV\nur4ckz//CFlbzbpmKwCi5wKBgQCMXO6fH1i9Gmc9vuj1cdTh93246WZDuy/c8Lbr\n5eQM2Igwmn9X+cJSklUqAw7M5u+vUKPaIQuKxJhPeHYHGag+Feo4aIyZEyUBrqs4\nSz9+VLxUOtGAYHWzAPIG1hBhGJ/QIyDawdwZukFaVqKqG+hNeQ/TpMkxp0T41S+l\ncMytfQKBgBEXvMDymCc6TcEpLFf2N7LvTZqip9C20rVA3gtcNs+OFVx9FlZeuXes\nMN4KsElE0/MUyUwlC9bjmN2Z7VV2mgTAvJQwi2ADTl8ADoTIGaVqm19WZVlnhLg5\ncPhHPuDTu0w0eCUJvz/7lWcX0ULag8Fpp0ICacSW+TFJvKUznhDj\n-----END RSA PRIVATE KEY-----";

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
    console.log("Access Token retrieved");

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

      eventNotification: {
        url: `${process.env.DOCUSIGN_WEBHOOK_URL}`,
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
