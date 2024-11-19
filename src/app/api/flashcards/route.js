import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req) {
  const { text, amountOfFlashCards } = await req.json();
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: `generate a set of only ${amountOfFlashCards} flashcards designed to help students study and retain the material effectively. Each flashcard should consist of a question and four possible answers, where only one answer is correct. The answers for each flashcard must be shuffled randomly to avoid predictability.`,
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
              flashCards: {
                type: "array",
                description: `List of ${amountOfFlashCards} flashcards, each containing a question and 4 possible answers.`,
                items: {
                  type: "object",
                  properties: {
                    question: {
                      type: "string",
                      description: "The question for the flashcard.",
                    },
                    answers: {
                      type: "array",
                      description:
                        "An array of 4 answer objects for the flashcard.",
                      items: {
                        type: "object",
                        properties: {
                          answer: {
                            type: "string",
                            description:
                              "The possible answer for the flashcard.",
                          },
                          correct: {
                            type: "boolean",
                            description: "Indicates if the answer is correct.",
                          },
                        },
                        required: ["answer", "correct"],
                      },
                      minItems: 4,
                      maxItems: 4,
                    },
                  },
                  required: ["question", "answers"],
                },
              },
            },
            required: ["flashCards"],
            additionalProperties: false,
          },
        },
      },
    });

    const flashCardsObject = completion.choices[0].message.content;

    console.log("Summarized Text:", flashCardsObject);

    return new Response(JSON.stringify({ flashCardsObject }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate the flashCards.",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
