import { useState } from "react";
import { parseChunkText } from "~/streamParser";
import { ChunkChatCompletionResponse } from "~/types/chatMessagesResponse";

export default function Chat() {
  const [text, setText] = useState<string>("");

  const sendMessage = async (): Promise<void> => {
    const messageBody: ChatMessagesRequestBody = {
      query: "200文字程度のダミーテキストを日本語で返してください",
    };
    console.log(crypto.randomUUID());
    const response = await fetch("/api/chat-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...messageBody }),
    });

    const reader = response.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader();
    try {
      for (;;) {
        const { value, done } = await reader?.read();
        if (done) break;

        const parsedChunkList =
          parseChunkText<ChunkChatCompletionResponse>(value);

        parsedChunkList
          .filter((chunk) => chunk != null)
          .forEach((chunk) => {
            if (chunk.event === "message" && chunk.answer) {
              setText((prevText) => prevText + chunk.answer);
            }
          });
      }
    } catch (error) {
      console.error("Stream processing error:", error);
      // TODO: エラー時のUIフィードバックを実装
    } finally {
      reader?.releaseLock();
    }
  };

  return (
    <div>
      <h1>Chat page</h1>
      <hr />
      <button onClick={sendMessage}>Send Message</button>
      <p>{text}</p>
    </div>
  );
}
