/** An object which records a span of text in source code. */
export interface SourceSpan {
  /** Start of the span, offset from beginning of file. */
  sourceStart: number;
  /**
   * End of the span, offset from beginning of file. Equal to the start offset
   * plus the length of the span.
   */
  sourceEnd: number;
}

/** Line and column in a file. */
export interface SourcePos {
  lineno: number;
  colno: number;
}

/** An error corresponding to a location in source code. */
export class SourceError extends Error implements SourceSpan {
  sourceStart: number;
  sourceEnd: number;
  constructor(start: number, end: number, message: string) {
    super(message);
    this.sourceStart = start;
    this.sourceEnd = end;
  }
}

/**
 * Translator between offset source positions and lines/columns.
 */
export class SourceText {
  readonly name: string;
  readonly lines: readonly string[];
  private readonly linePos: readonly number[];

  constructor(name: string, text: string) {
    this.name = name;
    const nl = /\n\r?|\r/g;
    const lines: string[] = [];
    const linePos: number[] = [0];
    let pos = 0;
    let match: RegExpMatchArray | null;
    while ((match = nl.exec(text)) != null) {
      lines.push(text.substring(pos, match.index));
      pos = nl.lastIndex;
      linePos.push(pos);
    }
    if (linePos[linePos.length - 1] != text.length) {
      lines.push(text.substr(pos));
      linePos.push(text.length);
    }
    this.lines = lines;
    this.linePos = linePos;
  }

  /** Find the line and column of the given source location. */
  lookup(sourcePos: number): SourcePos {
    let i = 1;
    while (i < this.linePos.length && sourcePos >= this.linePos[i]) {
      i++;
    }
    return { lineno: i, colno: sourcePos + 1 - this.linePos[i - 1] };
  }
}