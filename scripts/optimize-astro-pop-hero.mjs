import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import sharp from "sharp";

const repositoryRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(
  repositoryRoot,
  "public/images/astro-pop/hero/AstroPopDeliveryMan.png",
);
const outputDirectory = resolve(
  repositoryRoot,
  "artwork/astro-pop/experiments/hero",
);

const expectedSource = {
  format: "png",
  width: 1448,
  height: 1086,
};

const candidates = [
  {
    id: "desktop-webp-q80",
    filename: "astro-pop-delivery-man-1448w-q80.webp",
    width: 1448,
    format: "webp",
    options: { quality: 80, effort: 6 },
  },
  {
    id: "desktop-webp-q90",
    filename: "astro-pop-delivery-man-1448w-q90.webp",
    width: 1448,
    format: "webp",
    options: { quality: 90, effort: 6 },
  },
  {
    id: "tablet-webp-q80",
    filename: "astro-pop-delivery-man-960w-q80.webp",
    width: 960,
    format: "webp",
    options: { quality: 80, effort: 6 },
  },
  {
    id: "mobile-webp-q80",
    filename: "astro-pop-delivery-man-640w-q80.webp",
    width: 640,
    format: "webp",
    options: { quality: 80, effort: 6 },
  },
  {
    id: "desktop-avif-q55",
    filename: "astro-pop-delivery-man-1448w-q55.avif",
    width: 1448,
    format: "avif",
    options: { quality: 55, effort: 6, chromaSubsampling: "4:4:4" },
  },
];

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

const formatSize = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MiB`;

const createPipeline = (candidate) => {
  const pipeline = sharp(sourcePath, { sequentialRead: true }).resize({
    width: candidate.width,
    withoutEnlargement: true,
    kernel: sharp.kernel.lanczos3,
  });

  return candidate.format === "webp"
    ? pipeline.webp(candidate.options)
    : pipeline.avif(candidate.options);
};

const sourceMetadata = await sharp(sourcePath).metadata();

if (
  sourceMetadata.format !== expectedSource.format ||
  sourceMetadata.width !== expectedSource.width ||
  sourceMetadata.height !== expectedSource.height
) {
  throw new Error(
    `Unexpected source metadata: expected ${expectedSource.format} ${expectedSource.width}x${expectedSource.height}, received ${sourceMetadata.format} ${sourceMetadata.width}x${sourceMetadata.height}.`,
  );
}

await mkdir(outputDirectory, { recursive: true });

const sourceBuffer = await readFile(sourcePath);
const sourceStats = await stat(sourcePath);
const outputs = [];

for (const candidate of candidates) {
  const outputPath = resolve(outputDirectory, candidate.filename);
  const startedAt = process.hrtime.bigint();
  await createPipeline(candidate).toFile(outputPath);
  const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
  const outputMetadata = await sharp(outputPath).metadata();
  const outputStats = await stat(outputPath);
  const outputBuffer = await readFile(outputPath);

  outputs.push({
    ...candidate,
    path: relative(repositoryRoot, outputPath),
    bytes: outputStats.size,
    humanSize: formatSize(outputStats.size),
    dimensions: `${outputMetadata.width}x${outputMetadata.height}`,
    reductionPercent: Number(
      ((1 - outputStats.size / sourceStats.size) * 100).toFixed(2),
    ),
    sha256: sha256(outputBuffer),
    conversionMs: Number(elapsedMs.toFixed(2)),
  });
}

const manifest = {
  generatedBy: "scripts/optimize-astro-pop-hero.mjs",
  sharpRuntimeVersions: sharp.versions,
  source: {
    path: relative(repositoryRoot, sourcePath),
    bytes: sourceStats.size,
    humanSize: formatSize(sourceStats.size),
    dimensions: `${sourceMetadata.width}x${sourceMetadata.height}`,
    format: sourceMetadata.format,
    sha256: sha256(sourceBuffer),
  },
  candidates: outputs,
};

const manifestPath = resolve(outputDirectory, "manifest.json");
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.table(
  outputs.map((output) => ({
    candidate: output.id,
    dimensions: output.dimensions,
    format: output.format,
    bytes: output.bytes,
    reduction: `${output.reductionPercent}%`,
    conversionMs: output.conversionMs,
  })),
);
console.log(`Source: ${manifest.source.dimensions} ${manifest.source.humanSize}`);
console.log(`Manifest: ${relative(repositoryRoot, manifestPath)}`);
