import readline from "readline";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey:
    "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",
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion() {
  rl.question("Întrebare juridică: ", async (question) => {
    if (!question.trim()) {
      console.log("Întrebare goală. Ieșire.");
      rl.close();
      return;
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Ești un asistent juridic AI specializat în legislația Republicii Moldova pentru afaceri mici.",
          },
          { role: "user", content: question },
        ],
      });

      const answer = response.choices[0].message.content;
      console.log("\nRăspuns AI:");
      console.log(answer);
    } catch (error) {
      console.error("Eroare API:", error);
    }

    askQuestion();
  });
}

askQuestion();
