"use client";
import ProfileCard from "./ProfileCard";
import StatsCard from "./StatsCard";
import GameCard from "./GameCard";

export default function Profile() {
  return (
    <div className="flex justify-center min-h-[calc(100vh-65px)] h-full w-full bg-gray-800 text-text_color">
      <div className="flex flex-col h-fit max-w-[760px] mt-[80px]">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col justify-center sm:flex-row gap-20 sm:gap-5 items-center sm:items-start">
            <ProfileCard />
            <StatsCard />
          </div>
          <div className="flex sm:visible hidden flex-col sm:flex-row items-center sm:items-start justify-center gap-5 px-10">
            <GameCard title="Wordle" subTitle="A NEW WORD EACH DAY" />
            <GameCard title="Ordle" subTitle="THE SWEDISH WORDLE" />
            <GameCard title="Stepdle" subTitle="ONE STEP FURTHER" />
          </div>
        </div>
      </div>
    </div>
  );
}
