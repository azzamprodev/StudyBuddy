import { createClient } from "@/utils/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI();

const summarizeLecture = async (lectureName, lectureDescription, text) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: `You are a highly skilled summarizer specialized in educational content. Your task is to analyze a lecture PDF, summarize its key points in a concise manner, and generate a set of only four flashcards designed to help students study and retain the material effectively. Each flashcard should consist of a question and four possible answers, where only one answer is correct. The answers for each flashcard must be shuffled randomly to avoid predictability. i want you also to fill the first object key (lectureName) equals to ${lectureName} and the second key (lectureDescription) equals to ${lectureDescription}`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "summary_flashcards_schema",
          schema: {
            type: "object",
            properties: {
              lectureName: {
                type: "string",
                description: "The Name of the lecture provided by the user",
              },
              lectureDescription: {
                type: "string",
                description:
                  "The Description of the lecture provided by the user",
              },
              summary: {
                type: "string",
                description: "A brief summary of the provided text.",
              },
            },
            required: ["summary"],
            additionalProperties: false,
          },
        },
      },
    });
    if (!completion.choices || !completion.choices[0]?.message?.content) {
      console.log("Invalid response format from OpenAI.");
    }

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.log("Error summarizing lecture:", error);
  }
};

const saveLectureToDatabase = async (userId, lectureObject) => {
  const supabase = await createClient();
  const { error } = await supabase.from("lectures").insert({
    user_id: userId,
    lecture_name: lectureObject.lectureName,
    lecture_description: lectureObject.lectureDescription,
    summary: lectureObject.summary,
  });

  if (error) {
    console.log("Error saving lecture to database:", error);
  }
};

export async function POST(req) {
  const { lectureName, lectureDescription, text } = await req.json();
  try {
    const lectureObject = await summarizeLecture(
      lectureName,
      lectureDescription,
      text
    );
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not authenticated." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    await saveLectureToDatabase(user.id, lectureObject);

    return new Response(JSON.stringify({ lectureObject }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "An error occurred during processing.",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
