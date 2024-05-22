"use client";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { DocumentData } from "firebase-admin/firestore";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import FormatListNumberedRoundedIcon from "@mui/icons-material/FormatListNumberedRounded";
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import FormatColorTextRoundedIcon from "@mui/icons-material/FormatColorTextRounded";
import {
  Card,
  CardBody,
  Radio,
  RadioGroup,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@nextui-org/react";
import { useAuth } from "@/app/context/AuthContext";
import {
  LeaderBoard,
  LeaderBoardEntry,
  GeneralLeaderboardEntry,
} from "@/app/api/interfaces";
import useLocalStorage from "use-local-storage";
import { formatMilliseconds } from "@/app/utils";

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderBoardGeneral, setLeaderBoardGeneral] =
    useLocalStorage<DocumentData | null>("LeaderboardGeneral", null);
  const [leaderBoardWordle, setLeaderBoardWordle] =
    useLocalStorage<DocumentData | null>("LeaderBoardWordle", null);
  const [leaderBoardOrdle, setLeaderBoardOrdle] =
    useLocalStorage<DocumentData | null>("LeaderBoardOrdle", null);
  const [leaderBoardStepdle, setLeaderBoardStepdle] =
    useLocalStorage<DocumentData | null>("LeaderBoardStpdle", null);

  const columns = ["RANK", "USER", "AVG GUESSES", "AVG TIME"];
  const columnsGeneral = ["RANK", "USER", "AVG WIN RATE", "AVG TIME"];
  const dailyLeaderboardColumns = ["RANK", "USER", "GUESSES", "TIME"];

  useEffect(() => {
    const fetchLeaderboard = async (
      type: string
    ): Promise<{
      leaderboard: LeaderBoard;
    }> => {
      try {
        const userToken: string | undefined = await user?.getIdToken();
        const response = await fetch(`../api/leaderboard?type=${type}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${userToken}`,
            "Content-type": "application/json",
          },
        });
        if (response.ok) {
          const data: { leaderboard: LeaderBoard } =
            (await response.json()) as { leaderboard: LeaderBoard };
          return data;
        } else {
          throw new Error(
            `Failed to fetch leaderboard data: ${response.status}`
          );
        }
      } catch (error) {
        throw new Error(`Error fetching data: ${error}`);
      }
    };

    const loadData = async () => {
      const leaderboardGeneralObject: { leaderboard: LeaderBoard } =
        await fetchLeaderboard("general");
      const leaderboardWordleObject: { leaderboard: LeaderBoard } =
        await fetchLeaderboard("wordle");
      const leaderboardOrdleObject: { leaderboard: LeaderBoard } =
        await fetchLeaderboard("ordle");
      const leaderboardStepdleObject: { leaderboard: LeaderBoard } =
        await fetchLeaderboard("stepdle");
      setLeaderBoardGeneral(leaderboardGeneralObject.leaderboard);
      setLeaderBoardWordle(leaderboardWordleObject.leaderboard);
      setLeaderBoardOrdle(leaderboardOrdleObject.leaderboard);
      setLeaderBoardStepdle(leaderboardStepdleObject.leaderboard);
    };

    const unsubGeneral = onSnapshot(
      doc(db, "Leaderboards", "general"),
      (doc) => {
        const leaderboardData = doc.data();
        if (leaderboardData) {
          setLeaderBoardGeneral(leaderboardData.leaderboard);
        }
      }
    );

    const unsubWordle = onSnapshot(doc(db, "Leaderboards", "wordle"), (doc) => {
      const leaderboardData = doc.data();
      if (leaderboardData) {
        setLeaderBoardWordle(leaderboardData.leaderboard);
      }
    });

    const unsubOrdle = onSnapshot(doc(db, "Leaderboards", "ordle"), (doc) => {
      const leaderboardData = doc.data();
      if (leaderboardData) {
        setLeaderBoardOrdle(leaderboardData.leaderboard);
      }
    });

    const unsubStepdle = onSnapshot(
      doc(db, "Leaderboards", "stepdle"),
      (doc) => {
        const leaderboardData = doc.data();
        if (leaderboardData) {
          setLeaderBoardOrdle(leaderboardData.leaderboard);
        }
      }
    );

    const unsubscribe = function () {
      unsubGeneral();
      unsubWordle();
      unsubOrdle();
      unsubStepdle();
    };

    loadData();

    return () => unsubscribe();
  }, [
    setLeaderBoardGeneral,
    setLeaderBoardWordle,
    setLeaderBoardOrdle,
    setLeaderBoardStepdle,
    user,
  ]);

  return (
    <div className="flex justify-center h-[calc(100vh-65px)] w-screen bg-gray-800 text-text_color overflow-y-auto">
      <div className="mt-8 w-[85vw] min-w-[365px] md:min-w-[650px] max-w-[800px]">
        <Tabs className="w-full">
          <Tab
            title={
              <div className="flex items-center space-x-2">
                <LeaderboardRoundedIcon fontSize="small" />
                <span>General</span>
              </div>
            }
          >
            <Table
              aria-label="Example table with custom cells"
              selectionMode="single"
              color="default"
              selectedKeys={user?.email ? [user.email] : [""]}
              className="sm:max-h-[75vh] max-h-[60vh] overflow-hidden"
            >
              <TableHeader columns={["User"]}>
                {columnsGeneral.map((column, i) => (
                  <TableColumn key={i} align="start">
                    {column}
                  </TableColumn>
                ))}
              </TableHeader>

              <TableBody emptyContent={"No games played."}>
                {leaderBoardGeneral?.map(
                  (entry: GeneralLeaderboardEntry, i: number) => (
                    <TableRow key={entry.user}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="md:max-w-full max-w-[75px] overflow-hidden text-ellipsis">
                        {entry.user}
                      </TableCell>
                      <TableCell>{entry.averageWinRate?.toFixed(2)}</TableCell>
                      <TableCell>
                        {formatMilliseconds(entry.averageTime * 1000)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Tab>
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
              selectionMode="single"
              color="default"
              selectedKeys={user?.email ? [user.email] : [""]}
              className="sm:max-h-[75vh] max-h-[60vh] overflow-hidden"
            >
              <TableHeader columns={["User"]}>
                {dailyLeaderboardColumns.map((column, i) => (
                  <TableColumn key={i} align="start">
                    {column}
                  </TableColumn>
                ))}
              </TableHeader>

              <TableBody emptyContent={"No Wordle games played today."}>
                {leaderBoardWordle?.map(
                  (entry: LeaderBoardEntry, i: number) => (
                    <TableRow key={entry.user}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="md:max-w-full max-w-[75px] overflow-hidden text-ellipsis">
                        {entry.user}
                      </TableCell>
                      <TableCell>{entry.averageGuesses}</TableCell>
                      <TableCell>
                        {formatMilliseconds(entry.averageTime * 1000)}
                      </TableCell>
                    </TableRow>
                  )
                )}
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
              selectionMode="single"
              color="default"
              selectedKeys={user?.email ? [user.email] : [""]}
              className="sm:max-h-[75vh] max-h-[60vh] overflow-hidden"
            >
              <TableHeader columns={["User"]}>
                {dailyLeaderboardColumns.map((column, i) => (
                  <TableColumn key={i} align="start">
                    {column}
                  </TableColumn>
                ))}
              </TableHeader>

              <TableBody emptyContent={"No Ordle games played today."}>
                {leaderBoardOrdle?.map((entry: LeaderBoardEntry, i: number) => (
                  <TableRow key={entry.user}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="md:max-w-full max-w-[75px] overflow-hidden text-ellipsis">
                      {entry.user}
                    </TableCell>
                    <TableCell>{entry.averageGuesses}</TableCell>
                    <TableCell>
                      {formatMilliseconds(entry.averageTime * 1000)}
                    </TableCell>
                  </TableRow>
                ))}
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
              selectionMode="single"
              color="default"
              selectedKeys={user?.email ? [user.email] : [""]}
              className="sm:max-h-[75vh] max-h-[60vh] overflow-hidden"
            >
              <TableHeader columns={["User"]}>
                {dailyLeaderboardColumns.map((column, i) => (
                  <TableColumn key={i} align="start">
                    {column}
                  </TableColumn>
                ))}
              </TableHeader>

              <TableBody emptyContent={"No Stepdle games played today."}>
                {leaderBoardStepdle?.map(
                  (entry: LeaderBoardEntry, i: number) => (
                    <TableRow key={entry.user}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="md:max-w-full max-w-[75px] overflow-hidden text-ellipsis">
                        {entry.user}
                      </TableCell>
                      <TableCell>{entry.averageGuesses}</TableCell>
                      <TableCell>
                        {formatMilliseconds(entry.averageTime * 1000)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
