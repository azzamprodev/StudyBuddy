import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <>
      <div className="text-center flex flex-col justify-center items-center gap-4">
        <div className="text-sm flex items-center justify-center gap-4 border border-primary  py-1 px-6 rounded-full">
          Powered By AI
          <Sparkles strokeWidth={1.5} className="h-5 w-5" />
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
          Summarize lectures <br />
          instantly. Learn faster <br />
          with AI.
        </h1>
        <Link href={"/dashboard"}>
          <Button className="mt-8 py-5 flex items-center justify-center gap-2 hover:gap-4 hover:scale-110 transition-all duration-200">
            Get Started Today <ArrowRight />
          </Button>
        </Link>
      </div>
    </>
  );
};

export default HeroSection;
