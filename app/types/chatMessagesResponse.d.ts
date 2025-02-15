// Difyアプリケーションのレスポンスデータ

// Common interface properties
interface BaseStreamResponse {
  task_id: string;
  message_id: string;
  conversation_id: string;
  created_at: number;
}

// Message event response
interface MessageStreamResponse extends BaseStreamResponse {
  event: "message";
  answer: string;
}

// Agent message event response
interface AgentMessageStreamResponse extends BaseStreamResponse {
  event: "agent_message";
  answer: string;
}

// TTS message event response
interface TTSMessageStreamResponse extends BaseStreamResponse {
  event: "tts_message";
  audio: string;
}

// TTS message end event response
interface TTSMessageEndStreamResponse extends BaseStreamResponse {
  event: "tts_message_end";
  audio: string;
}

// File information
interface MessageFile {
  file_id: string;
}

// Agent thought event response
interface AgentThoughtStreamResponse extends BaseStreamResponse {
  event: "agent_thought";
  id: string;
  position: number;
  thought: string;
  observation: string;
  tool: string;
  tool_input: string;
  message_files: MessageFile[];
}

// Message file event response
interface MessageFileStreamResponse {
  event: "message_file";
  id: string;
  type: "image";
  belongs_to: "assistant";
  url: string;
  conversation_id: string;
}

// Usage information
interface Usage {
  [key: string]: any;
}

// Retriever resource information
interface RetrieverResource {
  [key: string]: any;
}

// Message end event response
interface MessageEndStreamResponse extends BaseStreamResponse {
  event: "message_end";
  metadata: {
    usage: Usage;
    retriever_resources: RetrieverResource[];
  };
}

// Message replace event response
interface MessageReplaceStreamResponse extends BaseStreamResponse {
  event: "message_replace";
  answer: string;
}

// Error event response
interface ErrorStreamResponse {
  event: "error";
  task_id: string;
  message_id: string;
  status: number;
  code: string;
  message: string;
}

// Ping event response
interface PingStreamResponse {
  event: "ping";
}

// Union type of all possible stream responses
type ChunkChatCompletionResponse =
  | MessageStreamResponse
  | AgentMessageStreamResponse
  | TTSMessageStreamResponse
  | TTSMessageEndStreamResponse
  | AgentThoughtStreamResponse
  | MessageFileStreamResponse
  | MessageEndStreamResponse
  | MessageReplaceStreamResponse
  | ErrorStreamResponse
  | PingStreamResponse;

export { ChunkChatCompletionResponse };
