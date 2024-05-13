"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  // Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import FormatListNumberedRoundedIcon from "@mui/icons-material/FormatListNumberedRounded";
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import FormatColorTextRoundedIcon from "@mui/icons-material/FormatColorTextRounded";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MenuBar() {
  const { user, signOutUser, userLoaded } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>(
    window.location.pathname
  );
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push("../");
    } catch (error) {
      console.error(error);
    }
  };

  const icons = {
    chevron: (
      <ExpandMoreRoundedIcon
        sx={{
          color: "white",
          "& path": {
            stroke: "#171717", // Need to be same as background color
            strokeWidth: 0.6, // Customize the border thickness
          },
        }}
      />
    ),
    wordle: (
      <TextFieldsRoundedIcon
        sx={{
          color: "#0070ef",
        }}
      />
    ),
    ordle: (
      <FormatColorTextRoundedIcon
        sx={{
          color: "#f5a523",
        }}
      />
    ),
    stepdle: (
      <FormatListNumberedRoundedIcon
        sx={{
          color: "#9455d3",
        }}
      />
    ),
  };

  return !userLoaded ? (
    <></>
  ) : (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-primary_background z-[100]"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarBrand>
        <p
          className="font-bold text-inherit cursor-pointer"
          onClick={() => {
            router.push("./profile");
            setSelectedTab("/auth/profile");
          }}
        >
          M I N D L E
        </p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Dropdown className="bg-secondary_menubar">
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="text-text_color bg-transparent data-[hover=true]:bg-transparent text-medium font-light"
                endContent={icons.chevron}
                radius="sm"
                variant="light"
              >
                Play
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="play-games"
            className="w-[340px]"
            itemClasses={{
              base: "gap-4",
            }}
          >
            <DropdownItem
              key="wordle-link"
              className="data-[hover=true]:bg-zinc-700 data-[hover=true]:text-text_color text-text_color"
              description="Guess a new word each day!"
              startContent={icons.wordle}
              onClick={() => {
                router.push("./wordle");
                setSelectedTab("");
              }}
            >
              Wordle
            </DropdownItem>
            <DropdownItem
              key="ordle-link"
              className="data-[hover=true]:bg-zinc-700 data-[hover=true]:text-text_color text-text_color"
              description="Ordle your way to word mastery"
              startContent={icons.ordle}
              onClick={() => {
                router.push("./ordle");
                setSelectedTab("");
              }}
            >
              Ordle
            </DropdownItem>
            <DropdownItem
              key="stepdle-link"
              className="data-[hover=true]:bg-zinc-700 data-[hover=true]:text-text_color text-text_color"
              description="Step up to the challenge"
              startContent={icons.stepdle}
              onClick={() => {
                router.push("./stepdle");
                setSelectedTab("");
              }}
            >
              Stepdle
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavbarItem>
          <Link
            href="./profile"
            aria-current="page"
            color="foreground"
            className={`${
              selectedTab === "/auth/profile" ? "font-medium" : "font-light"
            }`}
            onClick={() => setSelectedTab("/auth/profile")}
          >
            Profile
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="./leaderboard"
            aria-current="page"
            color="foreground"
            className={`${
              selectedTab === "/auth/leaderboard" ? "font-medium" : "font-light"
            }`}
            onClick={() => setSelectedTab("/auth/leaderboard")}
          >
            Leaderboard
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end" className="bg-secondary_menubar">
          {/* TODO: Fix the originalProps-error.
                    Seem to be some known error with the nextUI component, if you comment out
                    the <DropdownTrigger></DropdownTrigger> below the error disappears.
                    Link to issue: https://github.com/nextui-org/nextui/issues/2593
            */}
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="default"
              // name="Jason Hughes"
              size="sm"
              src={user?.photoURL || ""}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem
              key="profile"
              className="h-14 gap-2 data-[hover=true]:bg-zinc-700 data-[hover=true]:text-text_color text-text_color"
              onClick={() => router.push("./profile")}
              textValue="user-signed-in-as"
            >
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{user?.email}</p>
            </DropdownItem>
            {/* <DropdownItem
              key="settings"
              className="data-[hover=true]:bg-zinc-700 data-[hover=true]:text-white"
            >
              Settings
            </DropdownItem> */}
            <DropdownItem
              key="logout"
              className="text-[#f31260]"
              color="danger"
              onClick={handleSignOut}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarMenu className="dark backdrop-blur-xl bg-zinc-900/60">
        <NavbarMenuItem key="wordle">
          <Link
            className="w-full"
            color="foreground"
            href="./wordle"
            onClick={() => setIsMenuOpen(false)}
            //size="lg"
          >
            Wordle
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="ordle">
          <Link
            className="w-full"
            color="foreground"
            href="./ordle"
            onClick={() => setIsMenuOpen(false)}
            //size="lg"
          >
            Ordle
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="stepdle">
          <Link
            className="w-full"
            color="foreground"
            href="./stepdle"
            onClick={() => setIsMenuOpen(false)}
            //size="lg"
          >
            Stepdle
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="profile">
          <Link
            className="w-full"
            color="foreground"
            href="./profile"
            onClick={() => setIsMenuOpen(false)}
            //size="lg"
          >
            Profile
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="leaderboard">
          <Link
            className="w-full"
            color="foreground"
            href="./leaderboard"
            onClick={() => setIsMenuOpen(false)}
            //size="lg"
          >
            Leaderboard
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="logout">
          {/* <Link
            className="w-full hover:cursor-pointer"
            color="danger"
            //size="lg"
            onClick={handleSignOut}
          >
            Log Out
          </Link> */}
          <div
            className="w-full hover:cursor-pointer text-[#f31260]"
            //size="lg"
            onClick={handleSignOut}
            //href={""}
          >
            Log Out
          </div>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
