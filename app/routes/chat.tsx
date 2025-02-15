import { useState } from "react";

export default function Chat() { 
  const [text, setText] = useState<string>('')

  const sendMessage = async (): Promise<void> => {
    const response = await fetch('/api/chat-messages')

    const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()
    while (true) {
      const {value, done } = await reader?.read()
      if (done) break;
      console.log('Received', value)
      const raws = value.toString().split('\n').filter(line => line.trim() !== '')
      for (const raw of raws) {
        const message = raw.replace(/^data: /, '')
        const parsedData = JSON.parse(message)
        console.log({parsedData})
        if (parsedData.answer) {
          setText((prevText) => prevText + parsedData.answer)
        }
      }
    }
    reader?.releaseLock()
  }

  return (
    <div>
      <h1>Chat page</h1>
      <hr />
      <button onClick={sendMessage}>Send Message</button>
      <p>{ text }</p>
    </div>
  )
}
