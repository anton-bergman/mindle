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
import { LeaderBoard, LeaderBoardEntry } from "@/app/api/interfaces";
import useLocalStorage from "use-local-storage";
import { formatMilliseconds } from "@/app/utils";

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderBoardGeneral, setLeaderBoardGeneral] =
    useLocalStorage<DocumentData | null>("LeaderboardGeneral", null);
  const [leaderBoardWordle, setLeaderBoardWordle] =
    useLocalStorage<DocumentData | null>("LeaderBoardWordle", null);

  const columns = ["RANK", "USER", "AVG GUESSES", "AVG TIME"];
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
      setLeaderBoardGeneral(leaderboardGeneralObject.leaderboard);
      setLeaderBoardWordle(leaderboardWordleObject.leaderboard);
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

    const unsubscribe = function () {
      unsubGeneral();
      unsubWordle();
    };

    loadData();

    return () => unsubscribe();
  }, [setLeaderBoardGeneral, setLeaderBoardWordle, user]);

  return (
    <div className="flex justify-center h-[calc(100vh-65px)] w-screen bg-gray-800 text-white">
      <div className="mt-8 w-2/3">
        <Tabs>
          <Tab
            title={
              <div className="flex items-center space-x-2">
                <LeaderboardRoundedIcon fontSize="small" />
                <span>General</span>
              </div>
            }
          >
            <Table aria-label="Example table with custom cells">
              <TableHeader columns={["User"]}>
                {columns.map((column, i) => (
                  <TableColumn key={i} align="start">
                    {column}
                  </TableColumn>
                ))}
              </TableHeader>

              <TableBody emptyContent={"No games played."}>
                {leaderBoardGeneral?.map(
                  (entry: LeaderBoardEntry, i: number) => (
                    <TableRow key={entry.user}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{entry.user}</TableCell>
                      <TableCell>{entry.averageGuesses.toFixed(2)}</TableCell>
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
            <Table aria-label="Example table with custom cells">
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
                      <TableCell>{entry.user}</TableCell>
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
            <Table aria-label="Example table with custom cells">
              <TableHeader columns={["User"]}>
                {dailyLeaderboardColumns.map((column, i) => (
                  <TableColumn key={i} align="start">
                    {column}
                  </TableColumn>
                ))}
              </TableHeader>

              <TableBody emptyContent={"No Ordle games played today."}>
                {[]}
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
            <Table aria-label="Example table with custom cells">
              <TableHeader columns={["User"]}>
                {dailyLeaderboardColumns.map((column, i) => (
                  <TableColumn key={i} align="start">
                    {column}
                  </TableColumn>
                ))}
              </TableHeader>

              <TableBody emptyContent={"No Stepdle games played today."}>
                {[]}
              </TableBody>
            </Table>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
