"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useLecture } from "@/app/context/useLecture";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Pencil } from "lucide-react";
import {
  handleDeleteLecture,
  handleEditLecture,
} from "@/app/dashboard/(actions)/server-actions";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const LecturesList = ({ lectures }) => {
  const [deletingLecture, setDeletingLecture] = useState(false);
  const [editingLecture, setEditingLecture] = useState(false);
  const [currentLectureId, setCurrentLectureId] = useState(null);
  const [updatedLectureData, setUpdatedLectureData] = useState({
    lecture_name: "",
    lecture_description: "",
  });
  const [savingLecture, setSavingLecture] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { setCurrentLecture } = useLecture();
  const router = useRouter();

  const handleLectureClick = (index) => {
    setCurrentLecture(lectures[index]);
    router.push("/dashboard/summarizer");
  };

  const handleAddLectureClick = () => {
    setCurrentLecture(null);
    sessionStorage.removeItem("currentLecture");
  };

  const handleEditLectureDataChange = (event) => {
    setUpdatedLectureData({
      ...updatedLectureData,
      [event.target.name]: event.target.value,
    });
  };

  const handleEditLectureClick = (lectureId, lecture, e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the click event from propagating
    setCurrentLectureId(lectureId);
    setUpdatedLectureData({
      lecture_name: lecture.lecture_name,
      lecture_description: lecture.lecture_description,
    });
    setEditingLecture(true);
  };

  const handleSaveEditLecture = async () => {
    if (
      !updatedLectureData.lecture_name ||
      !updatedLectureData.lecture_description
    ) {
      toast({
        variant: "destructive",
        title: "Lecture name and description are required.",
      });
      return;
    } else {
      try {
        setSavingLecture(true);
        await handleEditLecture(currentLectureId, updatedLectureData);
        toast({
          variant: "success",
          title: "Lecture updated successfully.",
        });
        setEditingLecture(false);
      } catch (error) {
        console.error(error);
      } finally {
        setSavingLecture(false);
      }
    }
  };

  const handleDeleteClick = (lectureId, e) => {
    e.stopPropagation(); // Prevent the click event from propagating
    setCurrentLectureId(lectureId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteLecture = async () => {
    try {
      setDeletingLecture(true);
      await handleDeleteLecture(currentLectureId);
      toast({
        variant: "success",
        title: "Lecture deleted successfully.",
      });
      setShowDeleteDialog(false);
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingLecture(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 py-10">
        <div>
          <h1 className="text-3xl font-bold">
            {lectures.length === 0 ? "" : "Lectures"}
          </h1>
        </div>
        {lectures.length === 0 && (
          <div className="text-center text-xl">
            You don't have any{" "}
            <span className="bg-primary text-black p-1 rounded-md">
              Lectures.
            </span>
          </div>
        )}
        <div
          className={`grid grid-cols-1 gap-2 ${
            lectures.length === 1 ? "md:grid-cols-1" : "md:grid-cols-2"
          }`}
        >
          {lectures.map((lecture, index) => (
            <Card
              key={index}
              className="hover:cursor-pointer w-full"
              onClick={() => handleLectureClick(index)}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-2 ">
                    <CardTitle>{lecture.lecture_name}</CardTitle>
                    <CardDescription>
                      {lecture.lecture_description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      onClick={(e) => handleDeleteClick(lecture.id, e)}
                    >
                      <Trash2 />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={(e) =>
                        handleEditLectureClick(lecture.id, lecture, e)
                      }
                    >
                      <Pencil />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
        <Link href={"/dashboard/summarizer"}>
          <Button className="py-6 w-full" onClick={handleAddLectureClick}>
            Add Lecture
          </Button>
        </Link>
      </div>

      <Dialog open={editingLecture} onOpenChange={setEditingLecture}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lecture</DialogTitle>
            <DialogDescription>
              Update the lecture name and description.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              name="lecture_name"
              value={updatedLectureData.lecture_name}
              onChange={handleEditLectureDataChange}
              placeholder="Lecture Name"
              className="py-6"
            />
            <Input
              type="text"
              name="lecture_description"
              value={updatedLectureData.lecture_description}
              onChange={handleEditLectureDataChange}
              placeholder="Lecture Description"
              className="py-6"
            />
            <Button onClick={handleSaveEditLecture}>
              {savingLecture ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lecture</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lecture?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                className="w-full"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteLecture}
                className="w-full"
              >
                {deletingLecture ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
