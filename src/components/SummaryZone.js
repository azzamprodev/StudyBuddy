import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLecture } from "@/app/context/useLecture";
import { Card } from "./ui/card";

export const SummaryZone = () => {
  const router = useRouter();
  const { currentLecture } = useLecture();
  const [amountOfFlashCards, setAmountOfFlashCards] = useState(4);

  const handleFlashCardsClick = () => {
    router.push(`/dashboard/flashcards?amount=${amountOfFlashCards}`);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-6 my-10">
        <h1 className="text-3xl font-semibold">Summary of the Lecture</h1>
        <Card className="p-8 md:text-lg">{currentLecture.summary}</Card>
        <div className="flex flex-col text-center gap-2">
          <div className="flex items-center justify-center gap-3">
            <Button
              className="py-6 hover:scale-110 transition-all duration-300"
              onClick={() => {
                handleFlashCardsClick();
              }}
            >
              Generate Flash Cards
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="py-6 gap-3">
                  {`${amountOfFlashCards} Flash Cards`}
                  <ChevronDown size={24} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Amount of FlashCards</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={amountOfFlashCards}
                  onValueChange={setAmountOfFlashCards}
                >
                  <DropdownMenuRadioItem value={2}>
                    2 Flash Cards
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={4}>
                    4 Flash Cards
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={6}>
                    6 Flash Cards
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={8}>
                    8 Flash Cards
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <Link href={"/dashboard"}>
              <Button
                variant="Link"
                className="underline"
                onClick={() => {
                  sessionStorage.removeItem("currentLecture");
                }}
              >
                Back Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
