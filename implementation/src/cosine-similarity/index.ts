const a = [1, 10];
const b = [10, 0];

function dot(x: number[], y: number[]): number {
  if (x.length !== y.length) {
    throw new Error("Vectors must be of the same length");
  }
  return x.reduce((sum, xi, index) => sum + xi * y[index], 0);
}

function length(x: number[]): number {
  return Math.abs(Math.sqrt(x.reduce((sum, xi) => sum + xi * xi, 0)));
}

function cosineSimilarity(x: number[], y: number[]): number {
  return dot(x, y) / (length(x) * length(y));
}
function cosineDistance(x: number[], y: number[]): number {
  return 1 - cosineSimilarity(x, y);
}
function angleBetweenVectors(x: number[], y: number[]): number {
  const similarity = cosineSimilarity(x, y);
  return Math.acos(similarity) * (180 / Math.PI); // Convert radians to degrees
}

function normalizeVector(x: number[]): number[] {
  const len = length(x);
  if (len === 0) {
    return x;
  }
  return x.map((xi) => xi / len);
}

const aNormalized = normalizeVector(a);
const bNormalized = normalizeVector(b);
const normalSimilarity = dot(aNormalized, bNormalized);
console.log(`Cosine similarity between normalized a and b: ${normalSimilarity}`);
const similarity = cosineSimilarity(a, b);
console.log(`Cosine similarity between a and b: ${similarity}`);

const distance = cosineDistance(a, b);
console.log(`Cosine distance between a and b: ${distance}`);

const angle = angleBetweenVectors(a, b);
console.log(`Angle between a and b: ${angle} degrees`);
