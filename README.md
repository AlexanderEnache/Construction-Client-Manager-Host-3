
--- Construction Proposal Manager Web App ---

Powered by Next.js, Supabase and DocuSign

Setup Instructions:

To run Construction Proposal Manager Web App in a dev environment,
  - firstly ensure you have node and Next.js installed
  - simply clone the repository cd into the root folder,
  - run npm run build to build the project
  - then run npm run dev and navigate to localhost:3000 on your browser.

To get started you will first have to
  - create an account, you won't need to verify your email, then you can
  - navigate to your clients page using the navbar,
  - click on Add Clients to add a client's name and email address after which you can,
  - click on your newly added client and
  - click on add proposal.
  - Once you have added a proposal title, notes and a file, you can
  - click "Send DocuSign" and the app will automatically send the DocuSign to the clients email.

ENV Variables

  NEXT_PUBLIC_SUPABASE_URL=https://zndgsndlaojdddbxabus.supabase.co

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZGdzbmRsYW9qZGRkYnhhYnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTgxNTQsImV4cCI6MjA2OTYzNDE1NH0.BDbtaN6oy3OqJ6tWn3CC_DUQRZf29hrJVki5KkWh96Q
  
  DOCUSIGN_WEBHOOK_URL=https://construction-client-manager-host-3.vercel.app/api/docusign-webhook
  # .env.local
  DOCUSIGN_INTEGRATOR_KEY=318891d1-6df7-488f-a584-3c2d74fb0011
  DOCUSIGN_ACCOUNT_ID=2ae14585-6173-46a0-b794-7489aecf1f09
  DOCUSIGN_USER_ID=a470c2bc-c433-42cc-8cc0-c8252c9dd130
  DOCUSIGN_PRIVATE_KEY_PATH=./private.key
  DOCUSIGN_BASE_PATH=https://demo.docusign.net
  DOCUSIGN_OAUTH_BASE_PATH=account-d.docusign.com


Private Key (DocuSign)
  -----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAnyXtaeLx3ITEVYUj8D3rHHMAvXUFvqsFdMT3Y/fGSt01+PeR
6o40xANFxHn2kI+qqXTxumsfw5LExoRFswYjxU2P2Pm319yqMZGjBohkoMX1bzZG
jqwWO+gumqIM5J6DCLoqyOkHQeMH83LgTN+vGc+KuEArovUQqh5+m9O7X7pMiYiM
QyBvrzpp9ZalNm5VZJkj2F1Pqp2S1skcPyWlDwlWfCd+owbA3nKsreMz1GDp3+Mp
kpWNKjqgMazUVxae2e2AUqQnsbBx1vu77uORns1ichWSDHE/OmlNbdJ7vS7sj8/h
GMJzr47Zr4zJCYzieIn7y/J7tqSPEMg6X6y1aQIDAQABAoIBAA7fODWkJcZd6Mv2
FmLpolok/A14TUphSG/+RQEEQzU1QUkr92iEE/W6OY+P9yTQrBnMSheJ0azQvw8v
BqVhXj/ejOHxigbDwerCaYnffonQnewf1g2YkrZT7uD34j0N/AA5h2yBbDJxwQk0
s7WzVHVUwemQY5OFk6JWGa49pb2e8J/OZR4KMhxIym4gDdzd91JTNw9ulxi3DcEf
mnTh2U7RgnDFAHK6fy+ZDoQWP/DG2daV3o6diSSZm+ayrlqxYRpeNAQMMGQoGfQF
AeIVETZ9eqLTtHxg0+GmPCg/1WpTlHQiQXR3XKkgWU3E9smTn3oXG5hMoo48om18
sUPO41UCgYEA8JdJ0fcUoGJtsb2jCtkakAdIwiCmdheV6YLYgsfLyE7UVMW0/+9o
YaTv/PJuRPhX05SoJKMbFuAtDvpndDxoz4YNZvRqCi01gMD2bAn1k1MBHArPlOeG
1RSEdb0T42DAeP5fMTRIccPB0ufP6jEoUDhr1usOIIlcyPAaxXdKoDUCgYEAqVdP
BdrrYFcI3MGVB1UsOCNS77Wo4xz05OBjBsbKpN3EnSCyi8E81TRBGze1roQi+l+Z
kThq1ABjl/7oyK9rDTwuq0OcsfWddFC4tI7Pp4PFn5Vlo9qMiiB0dUVA5yuTodfo
cX7C7JJbUfRWt4JBT1QbBardcbPZ0eO6BI6WjuUCgYBmKniIlvnFWcbnMXZpBuSG
wPEerqrBfyaD8LJsZtecig0UqphADrQustHOgkxdMXBqQrhcRn8cabn4oFEKRRTk
+zH5xFS7WZNcx5RdMKV+GENiWxznSKIzHfFZ5h7p8Y4KU0qtJFyXIt/N5e6erp1F
44+3xj1Lh8lE8uELdarU+QKBgQCHY3uVldLsAoneXZM1+p3RAET1y8qMUgFl4BSs
PVGVAI2KhrLZU5S8bPvEtAS404JXpQlVdsLKXslBo5cfpEg1m7FAUl08VsAdV9Bk
420YZB0jmsFZgIkuggY6IDVk3Y06LzHzU8Kqe9UxL+YI78Yhk3/LRzGnD4EN80Et
FYdAFQKBgQDfC31+rJH5p1XSK+L7g1eVub9ctQYerbjVt7VN+O3fYRGrqoNfk+AP
+DydGhMpa37ht3RHHSjKE44jEwRMHDiijl7s7oShZ5jOkb8M4m7dPK81G21vUwK0
Gr1qJHDiXxVrJCKet6f0ArdHJZaO6O/bZlQtNRgD3FZQsjTT5WIJUA==
-----END RSA PRIVATE KEY-----

