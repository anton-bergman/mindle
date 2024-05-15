import React, { useEffect } from "react";
import FormatListNumberedRoundedIcon from "@mui/icons-material/FormatListNumberedRounded";
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import FormatColorTextRoundedIcon from "@mui/icons-material/FormatColorTextRounded";
import {
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@nextui-org/react";
import useLocalStorage from "use-local-storage";
import { decimalToPercentage, formatMilliseconds } from "@/app/utils";
import { GameStats } from "@/app/api/interfaces";
import { useAuth } from "@/app/context/AuthContext";

interface FormattedGameStats {
  averageGuesses: string | null;
  averageTime: string | null;
  totalGamesPlayed: number | null;
  winRate: string | null;
}

export default function StatsCard() {
  const { user } = useAuth();

  const [wordleStats, setWordleStats] =
    useLocalStorage<FormattedGameStats | null>("WordleStats", null);
  const [ordleStats, setOrdleStats] =
    useLocalStorage<FormattedGameStats | null>("OrdleStats", null);
  const [stepdleStats, setStepdleStats] =
    useLocalStorage<FormattedGameStats | null>("StepdleStats", null);

  const rows: Array<string> = [
    "WIN RATE",
    "GAMES PLAYED",
    "AVG GUESSES",
    "AVG TIME",
  ];

  useEffect(() => {
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
        const gameStats: GameStats = await fetchGameStats(gameType);
        const formattedGameStats: FormattedGameStats = {
          averageGuesses:
            gameStats.averageGuesses > 0
              ? gameStats.averageGuesses.toFixed(2)
              : null,
          averageTime:
            gameStats.averageTime > 0
              ? formatMilliseconds(gameStats.averageTime)
              : null,
          totalGamesPlayed:
            gameStats.totalGamesPlayed > 0 ? gameStats.totalGamesPlayed : null,
          winRate:
            gameStats.winRate > 0
              ? decimalToPercentage(gameStats.winRate)
              : null,
        };

        switch (gameType) {
          case "wordle": {
            setWordleStats(formattedGameStats);
            break;
          }
          case "ordle": {
            setOrdleStats(formattedGameStats);
            break;
          }
          default: {
            setStepdleStats(formattedGameStats);
            break;
          }
        }
      });
    };
    syncGameStats();
  }, [setOrdleStats, setStepdleStats, setWordleStats, user]);

  return (
    <div className="flex flex-col my-[-52px] min-w-[320px]">
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
                let value: number | string | undefined | null;
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
                    value = wordleStats?.averageGuesses;
                    break;
                  }
                  default: {
                    value = wordleStats?.averageTime;
                    break;
                  }
                }
                return (
                  <TableRow key={`wordle-${i}`}>
                    <TableCell className="text-xs font-medium">
                      {rowName}
                    </TableCell>

                    <TableCell className="text-xs font-medium text-right">
                      {value ? value : "-"}
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
                let value: number | string | undefined | null;
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
                    <TableCell className="text-xs font-medium">
                      {rowName}
                    </TableCell>

                    <TableCell className="text-xs font-medium text-right">
                      {value ? value : "-"}
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
                let value: number | string | undefined | null;
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
                    <TableCell className="text-xs font-medium">
                      {rowName}
                    </TableCell>

                    <TableCell className="text-xs font-medium text-right">
                      {value ? value : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Tab>
      </Tabs>
    </div>
  );
}
