"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { useDropzone } from "react-dropzone";
import { Upload, Sparkles } from "lucide-react";
import Typewriter from "typewriter-effect";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Link from "next/link";
import { useLecture } from "@/app/context/useLecture";
import { handleSummarize } from "@/app/dashboard/(actions)/client-actions";
import { HashLoader } from "react-spinners";
import pdfToText from "react-pdftotext";
import { Card } from "./ui/card";

export function LectureUploader({ setLoadSummary }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { setCurrentLecture } = useLecture();
  const [selectedFile, setSelectedFile] = useState(null);
  const [newLectureData, setNewLectureData] = useState({
    lectureName: "",
    lectureDescription: "",
  });

  const handleNewLectureInput = (event) => {
    const { id, value } = event.target;
    setNewLectureData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const summarizeClick = () => {
    handleSummarize({
      setLoadSummary,
      setLoading,
      selectedFile,
      newLectureData,
      setCurrentLecture,
      toast,
      pdfToText,
    });
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-grow flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-semibold">Cooking The Summary...</h1>
          <HashLoader color={"#f8eb25"} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="max-w-xl flex flex-col items-center justify-center gap-6">
            <div className="text-3xl font-semibold flex flex-col items-center justify-center gap-2">
              <h1>Summarize your lectures</h1>
              <Typewriter
                options={{
                  strings: ["effortlessly", "smoothly", "effectively"],
                  autoStart: true,
                  loop: true,
                  delay: 100,
                  deleteSpeed: 100,
                  cursorClassName: "text-primary",
                  wrapperClassName: "text-primary",
                }}
              />
            </div>
            <div className="flex flex-col gap-4 items-center justify-center max-w-xl min-w-[48vh]">
              <div className="grid gap-1 text-left md:grid-cols-2 w-full">
                <div>
                  <Label htmlFor="lectureName">Name</Label>
                  <Input
                    id="lectureName"
                    className="py-6"
                    onChange={handleNewLectureInput}
                  />
                </div>
                <div>
                  <Label htmlFor="lectureDescription">Description</Label>
                  <Input
                    id="lectureDescription"
                    className="py-6"
                    onChange={handleNewLectureInput}
                  />
                </div>
              </div>
              <Card
                {...getRootProps()}
                className="flex items-center justify-center text-center py-32 max-w-xl min-w-[48vh]"
              >
                <div className="w-2/3">
                  <input {...getInputProps()} />
                  <p className="text-xl">
                    {selectedFile
                      ? `File selected: ${selectedFile.name}`
                      : "Drag drop a PDF file here, or click to select one"}
                  </p>
                </div>
              </Card>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={() => {
                  summarizeClick();
                }}
                className="py-6 gap-2 hover:gap-4 hover:scale-110 transition-all duration-300"
              >
                Summarize
                <Sparkles strokeWidth={1.4} />
              </Button>
              <Link href="/dashboard">
                <Button
                  variant="link"
                  className="underline"
                  onClick={() => setCurrentLecture(null)}
                >
                  Back Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
