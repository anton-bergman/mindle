import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
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
import { useAuth } from "../context/AuthContext";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import FormatListNumberedRoundedIcon from "@mui/icons-material/FormatListNumberedRounded";
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MenuBar() {
  const { user, signOutUser, userLoaded } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push("/sign-in");
      console.log("bashash");
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
      className="bg-primary_background"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarBrand>
        <p className="font-bold text-inherit">M I N D L E</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Dropdown className="bg-secondary_menubar">
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="text-white bg-transparent data-[hover=true]:bg-transparent"
                //className="text-white"
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
              className="data-[hover=true]:bg-zinc-700 data-[hover=true]:text-white"
              description="Comming soon."
              startContent={icons.wordle}
              onClick={() => router.push("./wordle")}
            >
              Wordle
            </DropdownItem>
            <DropdownItem
              key="stepdle-link"
              className="data-[hover=true]:bg-zinc-700 data-[hover=true]:text-white"
              description="Comming soon."
              startContent={icons.stepdle}
              onClick={() => router.push("./stepdle")}
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
            className="font-light"
          >
            Profile
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="./leaderboard"
            aria-current="page"
            color="foreground"
            className="font-light"
          >
            Leaderboard
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end" className="bg-secondary_menubar">
          <DropdownTrigger>
            {/* TODO: Fix the originalProps-error
                Seem to be some known error with the nextUI component
                https://github.com/nextui-org/nextui/issues/2593
            */}
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="default"
              // name="Jason Hughes"
              size="sm"
              src={user?.photoURL || ""}
            />
            {/* <Button
              className="transition-transform"
              color="default"
              // name="Jason Hughes"
              size="sm"
            /> */}
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem
              key="profile"
              className="h-14 gap-2 data-[hover=true]:bg-zinc-700 data-[hover=true]:text-white"
              onClick={() => router.push("./profile")}
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
            <DropdownItem key="logout" color="danger" onClick={handleSignOut}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarMenu className="dark backdrop-blur-xl bg-zinc-900/60">
        <NavbarMenuItem key="wordle">
          <Link className="w-full" color="foreground" href="./wordle" size="lg">
            Wordle
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="stepdle">
          <Link
            className="w-full"
            color="foreground"
            href="./stepdle"
            size="lg"
          >
            Stepdle
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="profile">
          <Link
            className="w-full"
            color="foreground"
            href="./profile"
            size="lg"
          >
            Profile
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="leaderboard">
          <Link
            className="w-full"
            color="foreground"
            href="./leaderboard"
            size="lg"
          >
            Leaderboard
          </Link>
        </NavbarMenuItem>
        {/* <NavbarMenuItem key="settings">
          <Link className="w-full" color="foreground" href="#" size="lg">
            Settings
          </Link>
        </NavbarMenuItem> */}
        <NavbarMenuItem key="logout">
          <Link
            className="w-full hover:cursor-pointer"
            color="danger"
            size="lg"
            onClick={handleSignOut}
          >
            Log Out
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
