"use client";
import { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@nextui-org/react";
import { VscGithub } from "react-icons/vsc";
import Image from "next/image";
import mindleLogo from "@/public/images/mindle_logo_text.webp";

export default function SignIn() {
  const { user, loading, userLoaded, signInWithGoogle, signInWithGitHub } =
    useAuth();
  const router = useRouter();

  const handleSignIn = async (provider: String) => {
    try {
      switch (provider) {
        case "google":
          await signInWithGoogle();
          break;
        case "github":
          await signInWithGitHub();
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userLoaded) {
      router.push("auth/profile");
    }
  }, [loading, router, user, userLoaded]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-page_background text-white">
      <Image
        className="m-3 w-auto h-40"
        src={mindleLogo}
        alt="Mindle logo"
        priority={true}
        width={175}
      />
      <Button
        className="bg-white text-google_text shadow-black"
        variant="shadow"
        startContent={<FcGoogle />}
        onClick={() => handleSignIn("google")}
      >
        Sign in with Google
      </Button>

      <Button
        className="m-5 bg-github_btn shadow-black"
        variant="shadow"
        startContent={<VscGithub />}
        onClick={() => handleSignIn("github")}
      >
        Sign in with GitHub
      </Button>
    </div>
  );
}
