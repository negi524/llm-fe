export class DifyStreamParser {
  /**
   * 不自然に分割されたデータを格納する
   */
  private buffer: string;

  constructor() {
    // バッファが存在しない場合は空文字
    this.buffer = "";
  }

  /**
   * バッファの有無を確認する
   * @returns バッファが存在する場合true
   */
  private hasBuffer(): boolean {
    return this.buffer.length > 0;
  }

  /**
   * バッファの中身をクリアしつつ取り出す
   * @returns バッファに格納されている文字列
   */
  private popBuffer(): string {
    const result = this.buffer;
    this.buffer = "";
    return result;
  }

  /**
   * データフィールドかどうかを判定する
   * @param raw 判定対象の1行データ
   * @returns データイベントの行の場合true
   */
  private isDataRaw(raw: string): boolean {
    return raw.startsWith("data:");
  }

  /**
   * テキストデータの塊をデータの存在する行の配列に分割する
   * @param chunkText 複数行のテキストデータ集合
   * @returns データの存在する行データの配列
   */
  private divideLines(chunkText: string): string[] {
    const lines = chunkText.trim().split("\n");
    return lines.filter((line) => line.trim() !== "");
  }

  /**
   * データの中身部分を取得する
   * @param dataRaw data: ...
   * @returns データの中身
   */
  private getDataContent(dataRaw: string): string {
    return dataRaw.replace(/^data:\s*/, "");
  }

  /**
   * 文字列がJSONパース可能かどうかを判定する
   * @param jsonString 検査対象の文字列
   * @returns パース可能な場合true
   */
  private isValidJson(jsonString: string): boolean {
    try {
      JSON.parse(jsonString);
    } catch (error) {
      return false;
    }
    return true;
  }

  /**
   * その行データがパース可能か判定する
   * @param line 行データ
   * @returns dataコンテンツとしてパース可能な場合true
   */
  private isParsableDataLine(line: string): boolean {
    if (!this.isDataRaw(line)) {
      return false;
    }
    // 中身を取り出してJSONパース可能か確認
    const jsonString = this.getDataContent(line);
    if (!this.isValidJson(jsonString)) {
      return false;
    }
    return true;
  }

  /**
   * イベントストリームのデータを解析する
   * @param chunkText ストリームレスポンス
   * @returns JSONパースされたデータストリーム
   */
  public parseChunkText<T>(chunkText: string): T[] {
    const lines = this.divideLines(chunkText);

    const results: T[] = [];
    for (const line of lines) {
      // バッファが存在する場合、結合する
      const targetRaw = this.hasBuffer() ? this.popBuffer() + line : line;

      if (this.isParsableDataLine(targetRaw)) {
        const jsonString = this.getDataContent(targetRaw);
        results.push(JSON.parse(jsonString));
      } else {
        // パース不可の場合はバッファに格納し、次のデータと結合する
        this.buffer = targetRaw;
      }
    }

    return results;
  }
}
