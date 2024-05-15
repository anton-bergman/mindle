import React from "react";
import { Button, Card, CardFooter, CardHeader, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface GameCardProps {
  title: string;
  subTitle: string;
}

export default function GameCard({ title, subTitle }: GameCardProps) {
  const router = useRouter();
  return (
    <Card
      isFooterBlurred
      className="min-w-[204px] w-[204px] h-[238px] aspect-video col-span-12 sm:col-span-5"
    >
      <CardHeader className="absolute z-10 top-1 flex-col items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">
          {subTitle}
        </p>
        <h4 className="text-text_color font-medium text-2xl">{title}</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Card example background"
        className="z-0 mt-[70px] object-cover"
        src={"/images/wordle.webp"}
      />
      <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
        <Button
          className="text-tiny"
          color="primary"
          radius="full"
          size="sm"
          onClick={() => router.push(`./${title.toLowerCase()}`)}
        >
          Play now
        </Button>
      </CardFooter>
    </Card>
  );
}
