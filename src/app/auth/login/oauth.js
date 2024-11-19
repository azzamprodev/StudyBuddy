import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { oAuthLogin } from "./actions";
const providers = [
  {
    name: "github",
    displayName: "GitHub",
    icon: <FaGithub />,
  },
  {
    name: "google",
    displayName: "Google",
    icon: <FcGoogle />,
  },
];

export default function OAuthButtons() {
  return (
    <div className="flex gap-2 items-center justify-center w-full">
      {providers.map((provider) => (
        <Button
          key={provider.name}
          variant="outline"
          type="button"
          className="w-full"
          onClick={() => oAuthLogin(provider.name)}
        >
          {provider.icon}
          {provider.displayName}
        </Button>
      ))}
    </div>
  );
}
