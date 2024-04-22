"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect } from "react";

export default function Stepdle() {
  const { user } = useAuth();

  const fetchDataVocabulary = async () => {
    try {
      const userToken: string | undefined = await user?.getIdToken();
      const response = await fetch("../api/vocabulary?name=englishWords5", {
        method: "GET",
        headers: {
          authorization: `Bearer ${userToken}`,
          "Content-type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("data: ", data);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  };

  const fetchUserStats = async () => {
    try {
      const userToken: string | undefined = await user?.getIdToken();
      const response = await fetch("../api/user/stats?game=wordle", {
        method: "GET",
        headers: {
          authorization: `Bearer ${userToken}`,
          "Content-type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("data: ", data);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  };

  const fetchPlayedGames = async () => {
    try {
      const userToken: string | undefined = await user?.getIdToken();
      // Date Format: YYYY-MM-DDTHH:mm:ss.sssZ
      // const date: string =
      // "../api/played-games?date=1713304800000&game=wordle&uid=u9RvuXZZovWa5ORBcc4v6rPcab62"
      const response = await fetch(
        "../api/played-games?date=1713304800000&uid=u9RvuXZZovWa5ORBcc4v6rPcab62",
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${userToken}`,
            "Content-type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("data: ", data);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  };

  const fetchDailyGame = async () => {
    try {
      const userToken: string | undefined = await user?.getIdToken();
      const response = await fetch("../api/games?game=wordle", {
        method: "GET",
        headers: {
          authorization: `Bearer ${userToken}`,
          "Content-type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("data: ", data);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  };

  const fetchUserData = async () => {
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
        const data = await response.json();
        console.log("data: ", data);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  };

  const addPlayedGame = async () => {
    const playedGame = {
      userId: "NPvDMhqbOUT5F86d7ccxEFnZ0hQ2",
      gameType: "Games/ordle",
      startTime: 2,
      endTime: 3,
      guesses: ["bajsa", "hajar", "bastu", "", ""],
      numberOfGuesses: 3,
      wonGame: true,
    };
    try {
      const userToken: string | undefined = await user?.getIdToken();
      const response = await fetch("../api/played-games", {
        method: "POST",
        headers: {
          authorization: `Bearer ${userToken}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(playedGame),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("data: ", data);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  };

  const initializeUser = async () => {
    try {
      const userToken: string | undefined = await user?.getIdToken();
      const response = await fetch("../api/initialize-user", {
        method: "POST",
        headers: {
          authorization: `Bearer ${userToken}`,
          "Content-type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("data: ", data);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  };

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
        console.log("data: ", data);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      //await fetchDataVocabulary();
      //await fetchUserStats();
      //await fetchPlayedGames();
      //await fetchDailyGame();
      //await fetchUserData();
      //await addPlayedGame();
      //await initializeUser();
      // await fetchLeaderboard();
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Stepdle, Comming soon...</h1>
    </div>
  );
}
