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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
  TableColumn,
} from "@nextui-org/react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import VideogameAssetRoundedIcon from "@mui/icons-material/VideogameAssetRounded";
import { useEffect, useState } from "react";
import { User, LeaderBoard, GameStats } from "@/app/api/interfaces";
import FormatListNumberedRoundedIcon from "@mui/icons-material/FormatListNumberedRounded";
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import FormatColorTextRoundedIcon from "@mui/icons-material/FormatColorTextRounded";

interface ProfileStats {
  streak: number;
  rank: number;
  gamesPlayed: number;
}

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);

  const [wordleStats, setWordleStats] = useState<GameStats | null>(null);
  const [ordleStats, setOrdleStats] = useState<GameStats | null>(null);
  const [stepdleStats, setStepdleStats] = useState<GameStats | null>(null);

  const rows: string[] = [
    "WIN RATE",
    "GAMES PLAYED",
    "AVG GUESSES",
    "AVG TIME",
  ];

  useEffect(() => {
    const fetchUserData = async (): Promise<User> => {
      try {
        const userToken: string | undefined = await user?.getIdToken();
        const response = await fetch("../api/user", {
          method: "GET",
          headers: {
            authorization: `Bearer ${userToken}`,
            "Content-type": "application/json",
          },
        });
        if (response.ok) {
          const data: User = (await response.json()) as User;
          return data;
        } else {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }
      } catch (error) {
        throw new Error(`Error fetching data: ${error}`);
      }
    };
    const fetchLeaderboard = async (): Promise<{
      leaderboard: LeaderBoard;
    }> => {
      try {
        const userToken: string | undefined = await user?.getIdToken();
        const response = await fetch("../api/leaderboard?type=general", {
          method: "GET",
          headers: {
            authorization: `Bearer ${userToken}`,
            "Content-type": "application/json",
          },
        });
        if (response.ok) {
          const data = (await response.json()) as { leaderboard: LeaderBoard };
          return data;
        } else {
          throw new Error(`Failed to fetch leaderboard: ${response.status}`);
        }
      } catch (error) {
        throw new Error(`Error fetching data: ${error}`);
      }
    };

    const syncProfileStats = async () => {
      const leaderboardObj = await fetchLeaderboard();
      const userData: User = await fetchUserData();

      const userRank: number =
        1 +
        leaderboardObj.leaderboard.findIndex(
          (leaderboardEntry) => leaderboardEntry.user === user!.email
        );

      const stats: ProfileStats = {
        streak: userData.consecutiveDaysPlayed,
        rank: userRank,
        gamesPlayed: userData.totalGamesPlayed,
      };
      setProfileStats(stats);
    };

    const fetchGameStats = async (gameType: string): Promise<GameStats> => {
      try {
        const userToken: string | undefined = await user?.getIdToken();
        const response = await fetch(`../api/user/stats?game=${gameType}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${userToken}`,
            "Content-type": "application/json",
          },
        });
        if (response.ok) {
          const data: GameStats = (await response.json()) as GameStats;
          return data;
        } else {
          throw new Error(`Failed to fetch game stats: ${response.status}`);
        }
      } catch (error) {
        throw new Error(`Error fetching data: ${error}`);
      }
    };

    const syncGameStats = async () => {
      const gameTypes: Array<string> = ["wordle", "ordle", "stepdle"];

      gameTypes.forEach(async (gameType: string) => {
        let gameStats: GameStats = await fetchGameStats(gameType);
        gameStats = { ...gameStats, averageTime: gameStats.averageTime / 1000 };

        switch (gameType) {
          case "wordle": {
            setWordleStats(gameStats);
            break;
          }
          case "ordle": {
            setOrdleStats(gameStats);
            break;
          }
          default: {
            setStepdleStats(gameStats);
            break;
          }
        }
      });
    };
    syncGameStats();
    syncProfileStats();
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-65px)] bg-gray-800 text-white">
      <div>
        <div className="flex flex-row gap-4">
          <Card className="w-1/2 p-1">
            <CardHeader className="flex flex-row justify-evenly items-center">
              <Avatar
                isBordered
                className="w-16 h-16"
                color="default"
                src={user?.photoURL || ""}
              />
              <div className="flex flex-col">
                <h4 className="text-white font-medium text-2xl">
                  {user?.displayName}
                </h4>
                <p className="text-xs text-white/60 uppercase font-bold">
                  {user?.email}
                </p>
              </div>
            </CardHeader>
            <CardFooter className="justify-evenly">
              <Popover placement="bottom" className="dark">
                <PopoverTrigger>
                  <Button className="font-bold" variant="bordered">
                    <LeaderboardRoundedIcon />
                    {profileStats ? profileStats.rank : "-"}
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
                    <LocalFireDepartmentRoundedIcon />
                    {profileStats ? profileStats.streak : "-"}
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
                    {profileStats ? profileStats.gamesPlayed : "-"}
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
          {/* <Card className="w-1/2"></Card> */}
          {/* NEW RIGHT CARD BELOW */}
          <div className="flex flex-col my-[-52px] w-1/2">
            <Tabs>
              <Tab
                title={
                  <div className="flex items-center space-x-2">
                    <TextFieldsRoundedIcon fontSize="small" />
                    <span>Wordle</span>
                  </div>
                }
              >
                <Table
                  aria-label="Example table with custom cells"
                  hideHeader
                  isStriped
                >
                  <TableHeader columns={["User"]}>
                    <TableColumn align="start">Stat</TableColumn>
                    <TableColumn align="start">Value</TableColumn>
                  </TableHeader>

                  <TableBody>
                    {rows.map((rowName: string, i: number) => {
                      let value: number | undefined;
                      switch (rowName) {
                        case "WIN RATE": {
                          value = wordleStats?.winRate;
                          break;
                        }
                        case "GAMES PLAYED": {
                          value = wordleStats?.totalGamesPlayed;
                          break;
                        }
                        case "AVG GUESSES": {
                          value =
                            wordleStats?.averageGuesses === undefined
                              ? undefined
                              : parseFloat(
                                  wordleStats?.averageGuesses.toFixed(2)
                                );
                          break;
                        }
                        default: {
                          value =
                            wordleStats?.averageTime === undefined
                              ? undefined
                              : parseFloat(wordleStats?.averageTime.toFixed(2));
                          break;
                        }
                      }
                      return (
                        <TableRow key={`wordle-${i}`}>
                          <TableCell className="text-xs font-bold">
                            {rowName}
                          </TableCell>

                          <TableCell className="text-xs font-bold">
                            {value && value < 0 ? "-" : value}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Tab>
              <Tab
                title={
                  <div className="flex items-center space-x-2">
                    <FormatColorTextRoundedIcon fontSize="small" />
                    <span>Ordle</span>
                  </div>
                }
              >
                <Table
                  aria-label="Example table with custom cells"
                  hideHeader
                  isStriped
                >
                  <TableHeader columns={["User"]}>
                    <TableColumn align="start">Stat</TableColumn>
                    <TableColumn align="start">Value</TableColumn>
                  </TableHeader>

                  <TableBody>
                    {rows.map((rowName: string, i: number) => {
                      let value: number | undefined;
                      switch (rowName) {
                        case "WIN RATE": {
                          value = ordleStats?.winRate;
                          break;
                        }
                        case "GAMES PLAYED": {
                          value = ordleStats?.totalGamesPlayed;
                          break;
                        }
                        case "AVG GUESSES": {
                          value = ordleStats?.averageGuesses;
                          break;
                        }
                        default: {
                          value = ordleStats?.averageTime;
                          break;
                        }
                      }

                      return (
                        <TableRow key={`ordle-${i}`}>
                          <TableCell className="text-xs font-bold">
                            {rowName}
                          </TableCell>

                          <TableCell className="text-xs font-bold">
                            {value && value < 0 ? "-" : value}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Tab>
              <Tab
                title={
                  <div className="flex items-center space-x-2">
                    <FormatListNumberedRoundedIcon fontSize="small" />
                    <span>Stepdle</span>
                  </div>
                }
              >
                <Table
                  aria-label="Example table with custom cells"
                  hideHeader
                  isStriped
                >
                  <TableHeader columns={["User"]}>
                    <TableColumn align="start">Stat</TableColumn>
                    <TableColumn align="start">Value</TableColumn>
                  </TableHeader>

                  <TableBody>
                    {rows.map((rowName: string, i: number) => {
                      let value: number | undefined;
                      switch (rowName) {
                        case "WIN RATE": {
                          value = stepdleStats?.winRate;
                          break;
                        }
                        case "GAMES PLAYED": {
                          value = stepdleStats?.totalGamesPlayed;
                          break;
                        }
                        case "AVG GUESSES": {
                          value = stepdleStats?.averageGuesses;
                          break;
                        }
                        default: {
                          value = stepdleStats?.averageTime;
                          break;
                        }
                      }
                      return (
                        <TableRow key={`stepdle-${i}`}>
                          <TableCell className="text-xs font-bold">
                            {rowName}
                          </TableCell>

                          <TableCell className="text-xs font-bold">
                            {value && value < 0 ? "-" : value}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Tab>
            </Tabs>
          </div>
        </div>

        <div className="flex flex-row justify-between h-72 py-5 gap-5">
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
