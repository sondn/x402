import express from 'express';
import { paymentMiddleware, Resource, SolanaAddress, Network } from 'x402-express';
import { config } from 'dotenv';
config();

const facilitatorUrl = process.env.FACILITATOR_URL as Resource;
const payTo = process.env.PAY_TO_ADDRESS as `0x${string}` | SolanaAddress;
const networkName = (process.env.NETWORK_NAME || 'base-sepolia') as Network;

if (!facilitatorUrl || !payTo) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const app = express();
app.use(express.json());

// Translate all comments to English
// Define protected routes: $0.01 USDC on Base Sepolia
app.use(
  paymentMiddleware(
    payTo, // ← Replace with your merchant address (0x...)
    {
      '/protected-api': {
        price: '$0.01', // USD amount (convert to USDC)
        network: networkName,
      },
    },
    {
      url: facilitatorUrl,
    },
  )
);

// Protected route: Middleware will handle 402 + verify
app.get('/protected-api', (req, res) => {
  // If middleware passes (payment OK), return data
  res.json({ message: 'Protected endpoint OK' });
});

// Test route (unprotected)
app.get('/public-api', (req, res) => {
  res.json({ message: 'Public endpoint OK' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});