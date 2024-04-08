"use client";

import {
  Avatar,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import VideogameAssetRoundedIcon from "@mui/icons-material/VideogameAssetRounded";

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-65px)] bg-gray-800 text-white">
      <div>
        <div className="flex flex-row p-5 gap-5">
          <Card className="w-1/2">
            <CardHeader className="flex flex-row gap-5 justify-between items-center">
              <Avatar
                isBordered
                className="w-24 h-24"
                color="default"
                src={user?.photoURL || ""}
              />
              <div className="flex flex-col">
                <h4 className="text-white font-medium text-2xl">
                  {user?.displayName}
                </h4>
                <p className="text-tiny text-white/60 uppercase font-bold">
                  {user?.email}
                </p>
              </div>
            </CardHeader>
            <CardFooter className="justify-between">
              <Popover placement="bottom" className="dark">
                <PopoverTrigger>
                  <Button className="font-bold" variant="bordered">
                    <LeaderboardRoundedIcon />
                    15
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">
                    <div className="text-small font-bold">Rank</div>
                    <div className="text-tiny">
                      User&apos;s global
                      <br />
                      leaderboard position.
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Popover placement="bottom" className="dark">
                <PopoverTrigger>
                  <Button className="font-bold" variant="bordered">
                    <LocalFireDepartmentRoundedIcon />9
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">
                    <div className="text-small font-bold">Streak</div>
                    <div className="text-tiny">
                      Consecutive days with
                      <br />
                      gameplay activity.
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Popover placement="bottom" className="dark">
                <PopoverTrigger>
                  <Button className="font-bold" variant="bordered">
                    <VideogameAssetRoundedIcon />
                    143
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">
                    <div className="text-small font-bold">
                      Total Games Played
                    </div>
                    <div className="text-tiny">
                      Number of games completed
                      <br />
                      by a user.
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </CardFooter>
          </Card>
          <Card className="w-1/2"></Card>
        </div>

        <div className="flex flex-row h-72 p-5 gap-5">
          <Card
            isFooterBlurred
            className="w-56 aspect-video col-span-12 sm:col-span-5"
          >
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
              <p className="text-tiny text-white/60 uppercase font-bold">
                A new word each day
              </p>
              <h4 className="text-white font-medium text-2xl">Wordle</h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card example background"
              className="z-0 h-48 mt-20 object-cover"
              src={"/images/wordle.webp"}
            />
            <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
              <Button
                className="text-tiny"
                color="primary"
                radius="full"
                size="sm"
                onClick={() => router.push("./wordle")}
              >
                Play now
              </Button>
            </CardFooter>
          </Card>
          <Card
            isFooterBlurred
            className="w-56 aspect-video col-span-12 sm:col-span-5"
          >
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
              <p className="text-tiny text-white/60 uppercase font-bold">
                The Swedish wordle
              </p>
              <h4 className="text-white font-medium text-2xl">Ordle</h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card example background"
              className="z-0 h-48 mt-20 object-cover"
              src={"/images/wordle.webp"}
            />
            <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
              <Button
                className="text-tiny"
                color="primary"
                radius="full"
                size="sm"
                onClick={() => router.push("./ordle")}
              >
                Play now
              </Button>
            </CardFooter>
          </Card>
          <Card
            isFooterBlurred
            className="w-56 aspect-video col-span-12 sm:col-span-5"
          >
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
              <p className="text-tiny text-white/60 uppercase font-bold">
                One Step Further
              </p>
              <h4 className="text-white font-medium text-2xl">Stepdle</h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card example background"
              className="z-0 h-48 mt-20 object-cover"
              src={"/images/wordle.webp"}
            />
            <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
              <Button
                className="text-tiny"
                color="primary"
                radius="full"
                size="sm"
                onClick={() => router.push("./stepdle")}
              >
                Play now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
