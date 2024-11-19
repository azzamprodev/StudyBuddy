"use client";
import { useEffect, useState } from "react";
import { useLecture } from "@/app/context/useLecture";
import { useRouter } from "next/navigation";
import { HashLoader } from "react-spinners";
import { fetchFlashCards } from "../(actions)/client-actions";
import { FlashCards } from "@/components/FlashCards";

export default function Page({ searchParams }) {
  const router = useRouter();
  const { currentLecture } = useLecture();
  const [flashCards, setFlashCards] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentLecture === null) {
      router.push("/dashboard");
    } else {
      const getFlashCards = async () => {
        setIsLoading(true);
        const fetchedFlashCards = await fetchFlashCards({
          searchParams,
          currentLecture,
        });
        setFlashCards(fetchedFlashCards);
        setIsLoading(false);
      };
      getFlashCards();
    }
  }, [currentLecture, router, searchParams]);

  if (isLoading) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center gap-8">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Cooking The FlashCards...
        </h1>
        <HashLoader color={"#f8eb25"} />
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center">
      <FlashCards flashCards={flashCards} setFlashCards={setFlashCards} />
    </div>
  );
}
