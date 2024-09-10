import { useState, useEffect, memo, useMemo } from "react";
import { geologica } from "../fonts";
import { Option } from "../types";
import { UpTrend } from "../icons/up-trend";
import { DownTrend } from "../icons/down-trend";
import { Spinner } from "./Spinner";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return `${formattedMinutes}:${formattedSeconds}`;
}

const sentences = [
  "It won't take long, let's see if you are correct",
  "Okay! let's see if you are correct",
  "Let's see if you are correct",
  "Either way, let's see if you are correct",
  "You either win or lose, let's see if you are correct",
];

interface IPostSelectionProps {
  onCountdownEnd: () => void;
  seconds?: number;
  option: Option;
}

export const PostSelection = memo(
  ({ onCountdownEnd, option, seconds = 60 }: IPostSelectionProps) => {
    const [timeLeft, setTimeLeft] = useState(seconds);

    const sentence = useMemo(
      () => sentences[Math.floor(Math.random() * sentences.length)],
      []
    );

    useEffect(() => {
      if (timeLeft <= 0) {
        return;
      }
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onCountdownEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [onCountdownEnd]);

    return (
      <div className="flex gap-2 flex-col items-center">
        {option === "up" ? (
          <UpTrend className="text-green-500" />
        ) : (
          <DownTrend className="text-red-500" />
        )}

        {timeLeft === 0 ? (
          <Spinner color="#000" />
        ) : (
          <div className={`${geologica.className} text-4xl font-bold`}>
            {formatTime(timeLeft)}
          </div>
        )}
        <div>
          <p className="font-bold">{sentence}</p>
        </div>
      </div>
    );
  }
);
