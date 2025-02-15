import { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs): Promise<any> => {
  const token = process.env.DIFY_TOKEN;
  const body = (await request.json()) as ChatMessagesRequestBody;

  const response = await fetch("https://api.dify.ai/v1/chat-messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      inputs: {},
      query: body.query,
      response_mode: "streaming",
      conversation_id: body.conversationId ?? "",
      user: "abc-123",
      files: [],
    }),
  });
  return response;
};
