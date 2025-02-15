/**
 * ユーザーが送信する会話内容
 */
interface ChatMessagesRequestBody {
  /**
   * ユーザー入力、質問内容
   */
  query: string;
  /**
   * 会話ID
   */
  conversationId?: string;
}
