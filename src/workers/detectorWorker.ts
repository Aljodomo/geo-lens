import {
  CLIPSegForImageSegmentation,
  AutoProcessor,
  AutoTokenizer,
  RawImage,
  env,
} from '@huggingface/transformers';
import type { WorkerRequest, WorkerResponse, DetectedBoundingBox } from '../types';

env.allowLocalModels = false;
env.allowRemoteModels = true;
if (env.backends?.onnx?.wasm) {
  env.backends.onnx.wasm.numThreads = 1;
  env.backends.onnx.wasm.proxy = false;
}

let model: any = null;
let processor: any = null;
let tokenizer: any = null;
let isLoaded = false;
let loadPromise: Promise<void> | null = null;
const MODEL_ID = 'Xenova/clipseg-rd64-refined';

async function initModel(): Promise<void> {
  if (isLoaded) return;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    processor = await AutoProcessor.from_pretrained(MODEL_ID);
    tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID);
    model = await CLIPSegForImageSegmentation.from_pretrained(MODEL_ID, {
      dtype: 'q8',
      device: 'cpu',
    });
    isLoaded = true;
  })();

  return loadPromise;
}

function postResponse(msg: WorkerResponse) {
  self.postMessage(msg);
}

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const data = e.data;

  if (data.type === 'init') {
    await initModel();
    postResponse({ type: 'init_done' });
    return;
  }

  if (data.type === 'detect') {
    const { id, query, threshold, width: origW, height: origH, rawRgba } = data;

    try {
      await initModel();

      const rawImage = new RawImage(rawRgba, 512, 512, 4);
      const imageInputs = await processor(rawImage);
      const textInputs = tokenizer([query]);

      const inputs = {
        ...imageInputs,
        ...textInputs,
      };

      const outputs = await model(inputs);
      const logitsData = outputs.logits.data as Float32Array;

      const width = 352;
      const height = 352;
      const numPixels = width * height;
      const booleanMask = new Array<boolean>(numPixels);

      for (let i = 0; i < numPixels; i++) {
        const prob = 1 / (1 + Math.exp(-logitsData[i]));
        booleanMask[i] = prob >= threshold;
      }

      const visited = new Uint8Array(width * height);
      const detections: DetectedBoundingBox[] = [];

      const scaleX = origW / width;
      const scaleY = origH / height;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          if (booleanMask[idx] && !visited[idx]) {
            const queue: Array<[number, number]> = [[x, y]];
            visited[idx] = 1;

            let minX = x;
            let maxX = x;
            let minY = y;
            let maxY = y;
            let pixelCount = 0;

            while (queue.length > 0) {
              const [cx, cy] = queue.pop()!;
              pixelCount++;

              if (cx < minX) minX = cx;
              if (cx > maxX) maxX = cx;
              if (cy < minY) minY = cy;
              if (cy > maxY) maxY = cy;

              const neighbors: Array<[number, number]> = [
                [cx + 1, cy],
                [cx - 1, cy],
                [cx, cy + 1],
                [cx, cy - 1],
                [cx + 1, cy + 1],
                [cx - 1, cy - 1],
                [cx + 1, cy - 1],
                [cx - 1, cy + 1],
              ];

              for (const [nx, ny] of neighbors) {
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                  const nidx = ny * width + nx;
                  if (booleanMask[nidx] && !visited[nidx]) {
                    visited[nidx] = 1;
                    queue.push([nx, ny]);
                  }
                }
              }
            }

            if (pixelCount >= 8) {
              detections.push({
                box: [
                  Math.round(minX * scaleX),
                  Math.round(minY * scaleY),
                  Math.round(maxX * scaleX),
                  Math.round(maxY * scaleY),
                ],
                score: 0.9,
                label: query,
              });
            }
          }
        }
      }

      postResponse({
        type: 'detect_result',
        id,
        detections: detections.slice(0, 30),
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Detection failed in worker';
      postResponse({
        type: 'detect_error',
        id,
        error: errorMessage,
      });
    }
  }
};
