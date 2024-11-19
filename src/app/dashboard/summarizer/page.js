"use client";
import { useLecture } from "@/app/context/useLecture";
import { useRouter } from "next/navigation";
import { SummaryZone } from "@/components/SummaryZone";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import { LectureUploader } from "@/components/LectureUploader";

export default function Page() {
  const router = useRouter();
  const { currentLecture, setCurrentLecture } = useLecture();
  const [isLoading, setIsLoading] = useState(true);
  const [loadSummary, setLoadSummary] = useState(false);

  useEffect(() => {
    const storedLecture = sessionStorage.getItem("currentLecture");

    if (!currentLecture && storedLecture) {
      setCurrentLecture(JSON.parse(storedLecture));
      setLoadSummary(true);
    } else if (currentLecture) {
      setLoadSummary(true);
    } else {
      setLoadSummary(false);
    }

    setIsLoading(false);
  }, [currentLecture, setCurrentLecture, router]);

  if (isLoading) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center">
        <HashLoader color={"#f8eb25"} />
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="container max-w-3xl px-4">
        {loadSummary ? (
          <SummaryZone />
        ) : (
          <LectureUploader setLoadSummary={setLoadSummary} />
        )}
      </div>
    </div>
  );
}
