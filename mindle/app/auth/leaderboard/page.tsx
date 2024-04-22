"use client";

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
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import FormatListNumberedRoundedIcon from "@mui/icons-material/FormatListNumberedRounded";
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import FormatColorTextRoundedIcon from "@mui/icons-material/FormatColorTextRounded";
import { DocumentData } from "firebase-admin/firestore";
import { db } from "../../firebaseConfig";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/app/context/AuthContext";
import React from "react";

interface LeaderBoardEntry {
  user: string;
  averageGuesses: number;
  averageTime: number;
}

export default function Leaderboard() {
  const { user } = useAuth();

  const colummns = ["RANK", "USER", "GUESSES", "TIME"];
  const [leaderBoard, setLeaderBoard] = useState<DocumentData | undefined>([]);

  const fetchLeaderboard = async () => {
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
        const data = await response.json();
        return data;
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const leaderboardObject = await fetchLeaderboard();
      setLeaderBoard(leaderboardObject?.leaderboard);
    };

    const unsub = onSnapshot(doc(db, "Leaderboards", "general"), (doc) => {
      const leaderboardData = doc.data();
      if (leaderboardData) {
        setLeaderBoard(leaderboardData.leaderboard);
      }
    });
    loadData();
    return () => unsub();
  }, []);

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
                {/* <TableColumn key="test" align="start">
                  User
                </TableColumn> */}
                {colummns.map((column, i) => (
                  <TableColumn key={i} align="start">
                    {column}
                  </TableColumn>
                ))}
              </TableHeader>

              <TableBody>
                {leaderBoard?.map((entry: LeaderBoardEntry, i: number) => (
                  <TableRow key={entry.user}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{entry.user}</TableCell>
                    <TableCell>{entry.averageGuesses}</TableCell>
                    <TableCell>{entry.averageTime}</TableCell>
                  </TableRow>
                ))}
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
            <Card>
              <CardBody>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </CardBody>
            </Card>
          </Tab>
          <Tab
            title={
              <div className="flex items-center space-x-2">
                <FormatColorTextRoundedIcon fontSize="small" />
                <span>Ordle</span>
              </div>
            }
          >
            <Card>
              <CardBody>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </CardBody>
            </Card>
          </Tab>
          <Tab
            title={
              <div className="flex items-center space-x-2">
                <FormatListNumberedRoundedIcon fontSize="small" />
                <span>Stepdle</span>
              </div>
            }
          >
            <Card>
              <CardBody>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
