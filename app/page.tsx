import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { HomeClient } from "./HomeClient";
import { User } from "./lib/model";
import { getCurrentBitcoinPrice } from "./utils/getCurrentPrice";
import { fetchPriceHistory } from "./utils/fetchPriceHistory";

async function Home() {
  const session = await getSession();

  const [users, BTCPrice, btcPriceHistory] = await Promise.all([
    User.query("authUserId").eq(session?.user.sub).exec(),
    getCurrentBitcoinPrice(),
    fetchPriceHistory({ limit: 300 }),
  ]);

  /**
   * Fallback for when user doesn't exist yet
   * TODO: Remove this once user creation on registration is done
   */
  const score = users.count === 0 ? 0 : users[0].score;

  return (
    <HomeClient
      score={score}
      currentBTCPrice={BTCPrice}
      priceHistory={btcPriceHistory}
    />
  );
}

export default withPageAuthRequired(Home, {
  returnTo: "/api/auth/login",
});
