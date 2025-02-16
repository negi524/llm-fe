import { useState } from "react";
import Markdown from "~/components/chat/markdown";
import { DifyStreamParser } from "~/difyStreamParser";
import { ChunkChatCompletionResponse } from "~/types/chatMessagesResponse";

export default function Chat() {
  const [text, setText] = useState<string>("");
  const sendMessage = async (): Promise<void> => {
    const messageBody: ChatMessagesRequestBody = {
      query: "ピッタリ100文字のテキストを、改行込みの日本語で出力してください",
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
    const difyStreamParser = new DifyStreamParser();
    try {
      for (;;) {
        const { value, done } = await reader?.read();
        if (done) break;

        const parsedChunkList =
          difyStreamParser.parseChunkText<ChunkChatCompletionResponse>(value);

        parsedChunkList.forEach((chunk) => {
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
      <Markdown />
    </div>
  );
}
