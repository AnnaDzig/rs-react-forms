import { describe, expect, it, vi } from 'vitest';

import { fileToBase64 } from '../fileToBase64';

class SuccessfulFileReader {
  result: string | ArrayBuffer | null = null;

  private readonly listeners: Partial<Record<string, () => void>> = {};

  addEventListener(event: string, callback: () => void) {
    this.listeners[event] = callback;
  }

  readAsDataURL() {
    this.result = 'data:image/png;base64,test-image';
    this.listeners.load?.();
  }
}

class FailedFileReader {
  result: string | ArrayBuffer | null = null;

  private readonly listeners: Partial<Record<string, () => void>> = {};

  addEventListener(event: string, callback: () => void) {
    this.listeners[event] = callback;
  }

  readAsDataURL() {
    this.listeners.error?.();
  }
}

class InvalidResultFileReader {
  result: string | ArrayBuffer | null = null;

  private readonly listeners: Partial<Record<string, () => void>> = {};

  addEventListener(event: string, callback: () => void) {
    this.listeners[event] = callback;
  }

  readAsDataURL() {
    this.result = new ArrayBuffer(8);
    this.listeners.load?.();
  }
}

function createFile() {
  return new File(['test image content'], 'avatar.png', {
    type: 'image/png',
  });
}

describe('fileToBase64', () => {
  it('converts file to base64 string', async () => {
    vi.stubGlobal('FileReader', SuccessfulFileReader);

    await expect(fileToBase64(createFile())).resolves.toBe(
      'data:image/png;base64,test-image'
    );
  });

  it('rejects when FileReader emits error', async () => {
    vi.stubGlobal('FileReader', FailedFileReader);

    await expect(fileToBase64(createFile())).rejects.toThrow(
      'Failed to read image'
    );
  });

  it('rejects when FileReader result is not a string', async () => {
    vi.stubGlobal('FileReader', InvalidResultFileReader);

    await expect(fileToBase64(createFile())).rejects.toThrow(
      'Failed to convert image'
    );
  });
});
