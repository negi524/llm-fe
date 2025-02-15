/**
 * ストリームレスポンスを任意のオブジェクトにパースする
 * @param chunkText ストリームレスポンスのテキスト
 * @returns パースした結果のストリームレスポンス
 */
const parseChunkText = <T>(chunkText: string): T[] => {
  console.log({ chunkText });
  const raws = chunkText.split("\n").filter((line) => line.trim() !== "");
  return raws.map((raw) => {
    const response = raw.replace(/^data: /, "");
    try {
      return JSON.parse(response);
    } catch (error) {
      console.log(error, response);
    }
  });
};

export { parseChunkText };
