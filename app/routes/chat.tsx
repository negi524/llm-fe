import { useState } from "react";
import { parseChunkText } from "~/streamParser";
import { ChunkChatCompletionResponse } from "~/types/chatMessagesResponse";

export default function Chat() {
  const [text, setText] = useState<string>("");

  const sendMessage = async (): Promise<void> => {
    const response = await fetch("/api/chat-messages");

    const reader = response.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader();
    for (;;) {
      const { value, done } = await reader?.read();
      if (done) break;
      const parsedChunkList =
        parseChunkText<ChunkChatCompletionResponse>(value);
      parsedChunkList.forEach((chunk) => {
        if (chunk.event === "message" && chunk.answer) {
          setText((prevText) => prevText + chunk.answer);
        }
      });
    }
    reader?.releaseLock();
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
