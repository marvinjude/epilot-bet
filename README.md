## EpilotBet

Predict that the Price of BTC will go up⬆️ or down⬇️ after one minute!

[Demo](https://epilot-bet.vercel.app)

## How it works

When a prediction is made, we send a `POST` request that create a new prediction — calling it Option as they call it in the financial market. The request body looks like so:

```json
{
  optionType: "up" | "down", // The prediction
  timestamp: number, // Timestamp for when the prediction happened
}
```

On the backend, we persist the prediction in DynamoDB and schedule a background function to check the price of BTC after one minute. The background function will then update the user's score based on the correctness of the prediction.

On the frontend, after one minute, we pool inngest to see if the background function is done and then update the user's score.

## Running locally

Prerequisites: NodeJS 18.x

1. Clone the repository
2. copy `.env.example` to `.env.local` and fill in all the environment variables from the following services:

   - [Inngest](https://www.inngest.com/)
   - [DynamoDB](https://aws.amazon.com/dynamodb/)
   - [Clerk](https://clerk.com/)

3. Install dependencies - `npm install`
4. Run NextJS & Inngest dev server - `npm run dev`

## Tech Stack

- **Frontend**: NextJS(API Routes, Server Component)
- **Storage**: DynamoDB
- **Scheduling / Background function**: [Inngest](https://www.inngest.com/)
- **Host**: Vercel

## Todo

- [ ] Add tests
- [ ] Improve accuracy by checking for the price of BTC at a timestamp that is exactly one minute after the prediction was made instead of the current implementation that starts checking after one minute.

<!-- Centered text -->
<p align="center">
  Made with ❤️ in Santorini, Greece 🇬🇷 by <a href="https://linkedin.com/in/jude-agboola">Jude</a>
</p>
