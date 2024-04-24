"use client";
import ProfileCard from "./profileCard";
import StatsCard from "./StatsCard";
import GameCard from "./GameCard";

export default function Profile() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-65px)] bg-gray-800 text-white">
      <div className="flex flex-col gap-5">
        <div className="flex flex-row justify-between gap-5">
          <ProfileCard />
          <StatsCard />
        </div>
        <div className="flex flex-row justify-between gap-5 h-[248px]">
          <GameCard title="Wordle" subTitle="A NEW WORD EACH DAY" />
          <GameCard title="Ordle" subTitle="THE SWEDISH WORDLE" />
          <GameCard title="Stepdle" subTitle="ONE STEP FURTHER" />
        </div>
      </div>
    </div>
  );
}
