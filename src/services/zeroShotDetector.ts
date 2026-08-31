import type { DetectedBoundingBox, WorkerResponse } from '../types';

interface PendingRequest {
  resolve: (res: DetectedBoundingBox[]) => void;
  reject: (err: Error) => void;
}

class ZeroShotDetectorClient {
  private worker: Worker | null = null;
  private pendingRequests = new Map<string, PendingRequest>();
  private reqIdCounter = 0;

  private getWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(
        new URL('../workers/detectorWorker.ts', import.meta.url),
        { type: 'module' }
      );

      this.worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
        const data = e.data;

        if (data.type === 'detect_result') {
          const req = this.pendingRequests.get(data.id);
          if (req) {
            req.resolve(data.detections);
            this.pendingRequests.delete(data.id);
          }
        } else if (data.type === 'detect_error') {
          const req = this.pendingRequests.get(data.id);
          if (req) {
            req.reject(new Error(data.error));
            this.pendingRequests.delete(data.id);
          }
        }
      };

      this.worker.postMessage({ type: 'init' });
    }
    return this.worker;
  }

  public async load(): Promise<void> {
    this.getWorker();
  }

  public async detectBoundingBoxes(
    canvas: HTMLCanvasElement,
    query: string,
    threshold = 0.32
  ): Promise<DetectedBoundingBox[]> {
    const worker = this.getWorker();

    const targetSize = 512;
    const offscreen = document.createElement('canvas');
    offscreen.width = targetSize;
    offscreen.height = targetSize;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return [];

    offCtx.drawImage(canvas, 0, 0, targetSize, targetSize);
    const imgData = offCtx.getImageData(0, 0, targetSize, targetSize);
    const rawRgba = new Uint8Array(imgData.data.buffer);

    const id = `req_${++this.reqIdCounter}_${Date.now()}`;

    return new Promise<DetectedBoundingBox[]>((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });

      worker.postMessage(
        {
          type: 'detect',
          id,
          query,
          threshold,
          width: canvas.width,
          height: canvas.height,
          rawRgba,
        },
        [rawRgba.buffer]
      );
    });
  }
}

export const zeroShotDetector = new ZeroShotDetectorClient();
