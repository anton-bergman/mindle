import React, { useEffect } from "react";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import VideogameAssetRoundedIcon from "@mui/icons-material/VideogameAssetRounded";
import {
  Avatar,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import useLocalStorage from "use-local-storage";
import { useAuth } from "@/app/context/AuthContext";
import { LeaderBoard, User } from "@/app/api/interfaces";

interface ProfileStats {
  streak: number;
  rank: number;
  gamesPlayed: number;
}

export default function ProfileCard() {
  const { user } = useAuth();
  const [profileStats, setProfileStats] = useLocalStorage<ProfileStats | null>(
    "ProfileStats",
    null
  );

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
      const leaderboardObj: {
        leaderboard: LeaderBoard;
      } = await fetchLeaderboard();
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

    syncProfileStats();
  }, [setProfileStats, user]);

  return (
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
              <div className="text-small font-bold">Total Games Played</div>
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
  );
}
