"use client";

import { IOHLCData, SimpleOHLCChart } from "./components/Chart";
import { geologica } from "./fonts";
import Button from "./components/Button";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useState, useRef } from "react";

import { PostSelection } from "@/app/components/PostSelection";
import { Option } from "./types";
import { Logo } from "./icons/epilot-bet";
import { UpTrend } from "./icons/up-trend";
import { DownTrend } from "./icons/down-trend";
import { RealTimePrice } from "./components/RealTimePrice";
import toast, { Toaster } from "react-hot-toast";
import { getRuns } from "./lib/inngest/utils/getRuns";
import retry from "async-retry";
import { log } from "@/app/utils/log";
import { IResolveOptionFunctionOutput } from "./lib/inngest/functions/resolve-option";

export function HomeClient(props: {
  score: number;
  currentBTCPrice: number;
  priceHistory: IOHLCData[];
}) {
  const {
    score: userScore,
    currentBTCPrice,
    priceHistory: btcPriceHistory,
  } = props;

  const { user } = useUser();
  const [priceHistory, setPriceHistory] = useState<IOHLCData[]>(
    () => btcPriceHistory
  );
  const [isAwaitingOptionResolution, setIsAwaitingOptionResolution] =
    useState(false);
  const [isInitilizingOption, setIsInitilizingOption] = useState(false);
  const [score, setScore] = useState(() => userScore);

  const lastOptionRef = useRef<Option>("up");
  const jobRef = useRef<string | null>(null);

  const onOption = async (option: Option) => {
    const timestamp = Date.now();

    lastOptionRef.current = option;

    setIsInitilizingOption(true);

    try {
      const response = await fetch("/api/option", {
        method: "POST",
        body: JSON.stringify({
          optionType: option,
          timestamp,
        }),
      });

      if (!response.ok) {
        toast.error("Error creating option", {
          position: "top-right",
        });

        return;
      }

      const data = (await response.json()) as {
        success: boolean;
        data: {
          id: string;
          userId: string;
          option: Option;
          priceAtCreation: number;
          createdAt: number;
          resolved: boolean;
          jobId: string;
        };
      };

      jobRef.current = data.data.jobId;

      toast.success("Option created successfully", {
        position: "top-right",
      });

      setIsInitilizingOption(false);
      setIsAwaitingOptionResolution(true);
    } catch {}
  };

  const onCountdownEnd = async () => {
    /**
     * Check the status of the job and act accordingly
     */
    if (jobRef.current === null) {
      return toast.error("Something went wrong", {
        position: "top-right",
      });
    }

    try {
      const runResult = await retry(
        async (bail) => {
          const runs = await getRuns<IResolveOptionFunctionOutput>(
            jobRef.current as string
          );

          if (runs[0].status === "Running") {
            throw new Error("Option is still reolsving, retrying...");
          }

          if (runs[0].status === "Failed") {
            bail(new Error("Option resolution failed"));
          }

          return runs[0];
        },
        {
          retries: 10,
          minTimeout: 2000,
          onRetry: (err, attempt) => {
            log(`Attempt #${attempt}: ${err.message}`);
          },
        }
      );

      const { isCorrect, score } = runResult.output;

      setScore(runResult.output.score);
      setIsAwaitingOptionResolution(false);

      if (isCorrect) {
        toast.success(`Your guess was correct! New score is ${score}`, {
          position: "top-right",
        });
      } else {
        toast.error(`Your guess was wrong! New score is ${score}`, {
          position: "top-right",
        });
      }
    } catch (e) {
      return toast.error("Something wen't wrong", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="min-h-screen px-20">
      <header className="p-5 flex item-center justify-between">
        <Logo />
        <Link href="/api/auth/logout">Log out</Link>
      </header>
      <Toaster />
      <main className="p-5">
        <div className="flex flex-col items-center justify-center">
          <div className="flex justify-center flex-col">
            <h1 className="text-5xl font-bold product-heading">
              Bitcon Price Prediction
            </h1>
            <p className="text-center">
              PREDICT THE BITCOIN PRICE DIRECTION AND WIN!
            </p>
          </div>
          <div className="flex gap-2 mt-10">
            <div>
              <h2 className="font-bold">BTC/USD</h2>
              <RealTimePrice defaultPrice={currentBTCPrice} />
            </div>
            <div className="pl-10">
              <h2 className="font-bold">YOUR SCORE</h2>
              <p className={`${geologica.className} text-3xl font-bold`}>
                {score}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-gray-100 min-h-60 shadow rounded-lg">
          <SimpleOHLCChart data={priceHistory ?? []} />
        </div>

        <div className="flex justify-center">
          <div className="bg-white p-5 rounded w-1/2 -m-[50px] shadow border z-10 text-gray-800">
            {isAwaitingOptionResolution && (
              <PostSelection
                option={lastOptionRef.current}
                onCountdownEnd={onCountdownEnd}
              />
            )}

            {!isAwaitingOptionResolution && (
              <div className="flex flex-col items-center">
                <p className="font-bold uppercase">
                  {user && `${user?.given_name}, `}WHAT WAY WILL PRICE OF BTC GO
                  AFTER A MINUTE?
                </p>
                <div className="flex gap-2 my-2 items-center">
                  <Button
                    isLoading={
                      isInitilizingOption && lastOptionRef.current === "up"
                    }
                    onClick={() => onOption("up")}
                    variant="green"
                    icon={<UpTrend />}
                  >
                    UP
                  </Button>
                  <span>OR</span>
                  <Button
                    isLoading={
                      isInitilizingOption && lastOptionRef.current === "down"
                    }
                    onClick={() => onOption("down")}
                    variant="red"
                    icon={<DownTrend />}
                  >
                    DOWN
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
