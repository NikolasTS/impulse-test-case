import { Observable } from 'rxjs';

export function readCSVStream(csv: string): Observable<string[]> {
  let buffer = '';
  let result: string[] = [];

  return new Observable<string[]>((subscriber) => {
    for (const char of csv) {
      // if end of column -> push to result
      if (char === ',') {
        result.push(buffer);
        buffer = '';
        continue;
      }

      // if end of line -> push result to subscriber and reset buffer
      if (char === '\n') {
        result.push(buffer);
        subscriber.next(result);
        buffer = '';
        result = [];
        continue;
      }

      buffer += char;
    }
    if (buffer) {
      result.push(buffer);
      subscriber.next(result);
    }
    subscriber.complete();
  });
}
