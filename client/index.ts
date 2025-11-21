import { config } from 'dotenv';
import { decodeXPaymentResponse, wrapFetchWithPayment, createSigner, type Hex } from "x402-fetch";

config();

const privateKey = process.env.PAYER_PRIVATE_KEY as Hex | string;
const baseURL = process.env.SERVER_URL as string;
const networkName = (process.env.NETWORK_NAME || 'base-sepolia') as string;
const endpointPath = '/protected-api' as const;
const publicEndpointPath = '/public-api' as const;

/**
 * This example shows how to use the x402-fetch package to make a request to a resource server that requires a payment.
 *
 * To run this example, you need to set the following environment variables:
 * - PAYER_PRIVATE_KEY: The private key of the EVM signer
 * - SERVER_URL: The URL of the server
 * - ENDPOINT_PATH: The path of the endpoint to call on the server
 */
async function main(): Promise<void> {
  // const signer = await createSigner("solana-devnet", privateKey); // uncomment for solana
  const signer = await createSigner(networkName, privateKey);
  const fetchWithPayment = wrapFetchWithPayment(fetch, signer, BigInt(1000000));
  
  // protected endpoint
  const protectedUrl = `${baseURL}${endpointPath}`;
  const response = await fetchWithPayment(protectedUrl, { method: "GET" });
  const body = await response.json();
  console.log(`Protected endpoint response: ${JSON.stringify(body)}`);

  const paymentResponse = decodeXPaymentResponse(response.headers.get("x-payment-response")!);
  console.log(`Payment response: ${JSON.stringify(paymentResponse)}`);

  // public endpoint
  const publicUrl = `${baseURL}${publicEndpointPath}`;
  const publicResponse = await fetchWithPayment(publicUrl, { method: "GET" });
  const publicBody = await publicResponse.json();
  console.log(`Public endpoint response: ${JSON.stringify(publicBody)}`);

}

main().catch(error => {
  console.error(error?.response?.data?.error ?? error);
  process.exit(1);
});