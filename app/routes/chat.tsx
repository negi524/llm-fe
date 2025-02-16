import { useState } from "react";
import { DifyStreamParser } from "~/difyStreamParser";
import { ChunkChatCompletionResponse } from "~/types/chatMessagesResponse";
import ReactMarkdown from "react-markdown";

export default function Chat() {
  const [text, setText] = useState<string>("");
  const sampleContent = `
# h1
## h2
### h3
#### h4
##### h5
###### h6

普通のテキスト

- リスト1
- リスト2
  - サブリスト1

1. 番号付きリスト1
2. 番号付きリスト2
3. 番号付きリスト3

**太字**
*斜体*
~~取り消し線~~

[Link](/test)

> 引用1

---

- [ ] 未完了のタスク
- [x] 完了したタスク

| 見出し1 | 見出し2 |
|---------|---------|
| 内容1   | 内容2   |
| 内容3   | 内容4   |

Markdown:  
  軽量なマークアップ言語  
React:  
  JavaScriptライブラリ

<span style="color: red;">赤い文字</span>
 
[^1]: 注釈です。

<details>
  <summary>クリックして詳細を見る</summary>
  詳細な説明がここに入ります。
</details>


  `;

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
      <ReactMarkdown>{sampleContent}</ReactMarkdown>
    </div>
  );
}
