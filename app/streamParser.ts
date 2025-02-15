type BufferState = {
  buffer: string;
  isComplete: boolean;
};

/**
 * ストリームレスポンスを任意のオブジェクトにパースする
 * @param chunkText ストリームレスポンスのテキスト
 * @returns パースした結果のストリームレスポンス
 */
const parseChunkText = <T>(chunkText: string): T[] => {
  // 空白を除去して正規化
  const normalizedText = chunkText.trim();
  const chunks = normalizedText
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => line.replace(/^data: /, ""));

  const results: T[] = [];
  let currentBuffer: BufferState = { buffer: "", isComplete: true };

  for (const chunk of chunks) {
    try {
      // バッファが存在する場合は結合を試みる
      const textToProcess = currentBuffer.isComplete
        ? chunk
        : currentBuffer.buffer + chunk;

      // パース試行
      const parsed = JSON.parse(textToProcess);
      results.push(parsed);
      // バッファをリセット
      currentBuffer = { buffer: "", isComplete: true };
    } catch (error) {
      if (error instanceof SyntaxError) {
        // JSONが不整合な場合はバッファに保存
        currentBuffer = { buffer: chunk, isComplete: false };
        console.warn("Incomplete JSON detected, buffering:", chunk);
      } else {
        // その他のエラーの場合は警告を出してスキップ
        console.error("Error parsing chunk:", error);
      }
      continue;
    }
  }
  return results;
};

export { parseChunkText };
