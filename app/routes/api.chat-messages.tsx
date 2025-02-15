
export const loader = async (): Promise<any> => {
  const token = process.env.DIFY_TOKEN

  const response = await fetch('https://api.dify.ai/v1/chat-messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        "inputs": {},
        "query": "こんにちは",
        "response_mode": "streaming",
        "conversation_id": "",
        "user": "abc-123",
        "files": []
    })
  });
  return response
}
