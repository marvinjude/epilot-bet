import { getCurrentBitcoinPrice } from "@/app/utils/getCurrentPrice";
import { inngest } from "..";
import { Option, User } from "../../model";

export interface IResolveOptionFunctionOutput {
  isCorrect: boolean;
  currentPrice: number;
  priceAtCreation: number;
  optionType: string;
  score: number;
}

export const resolveOption = inngest.createFunction(
  { id: "resolve-option" },
  { event: "test/resolve.option" },
  async ({ event, step }) => {
    await step.sleep("wait-for-a-minute", "60s");

    const { user, option } = event.data;

    const currentPrice = await getCurrentBitcoinPrice();

    let score = user.score;

    const isCorrect =
      (option.type === "up" && currentPrice > option.priceAtCreation) ||
      (option.type === "down" && currentPrice < option.priceAtCreation);

    score += isCorrect ? 1 : -1;

    await Option.update(option.id, {
      resolved: true,
      priceAfterResolve: currentPrice,
    });

    await User.update(user.id, {
      score,
    });

    const output: IResolveOptionFunctionOutput = {
      isCorrect,
      currentPrice,
      priceAtCreation: option.priceAtCreation,
      optionType: option.type,
      score,
    };

    return output;
  }
);
