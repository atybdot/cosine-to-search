---
title: cosine similarity and walking the image folder
stage: "01"
date: 2026-11-09
---
## Before

I wrote no prediction for the cosine test. I ran it first.

For the image folder I assumed one embedding was `width x height x 4` bytes, so I planned to read the real image sizes and make the table more accurate than a fixed 512x512. That assumption was wrong.

## Did

Ran the cosine script at `implementation/src/cosine-similarity/index.ts` with `vpx`. The test vectors were `a = [1, 10]` and `b = [10, 0]`. It printed the normalized dot product, cosine similarity, cosine distance, and the angle in degrees.

Implemented `normalizeVector`, divided `a` and `b` by their lengths, and called `dot` on the normalized vectors. Called `cosineSimilarity` on the raw vectors. Both paths printed the same number.

Ran `implementation/src/cosine-similarity/traverse-assets.ts` over `lib/data/images` with `vpx`. The script filters `jpg`, `jpeg`, `png`, `gif`, and `webp` files, reads each image's dimensions with `image-size`, and multiplies `height x width x 4` for every file. It prints a running total after the first 100 images, the first 1,000, the first 2,000, and all 2,316.

## Numbers

### Cosine on the test pair

| Metric | Value |
|---|---|
| `dot(a, b)` | 10 |
| `length(a)` | 10.04987562112089 |
| `length(b)` | 10 |
| cosine similarity | 0.09950371902099892 |
| cosine distance | 0.9004962809790011 |
| angle | 84.28940686250037 degrees |

### Normalization proof

`a_hat = [0.0995037190209989, 0.9950371902099892]`
`b_hat = [1, 0]`

| Quantity | Value |
|---|---|
| `dot(a_hat, b_hat)` | 0.09950371902099892 |
| `cosineSimilarity(a, b)` | 0.09950371902099892 |
| difference | 0 |

### Raw pixel totals from the image folder

These are cumulative totals, so the 1,000 row includes the first 100.

| Set | Images | Raw pixel bytes | Average per image | MiB |
|---|---:|---:|---:|---:|
| first 100 | 100 | 71,192,892 | 711,929 | 67.89 |
| first 1,000 | 1,000 | 710,624,324 | 710,624 | 677.70 |
| first 2,000 | 2,000 | 1,435,671,100 | 717,836 | 1,369.16 |
| all files | 2,316 | 1,659,670,624 | 716,611 | 1,582.79 |

The compressed JPG files together are 54,261,191 bytes, or 51.75 MiB. The raw pixel buffers are 30.59 times larger.

### Embedding storage

One image costs `dimensions x 4` bytes, because each float32 is 4 bytes. Image width and height do not enter this number. At 512 dimensions one vector is 2,048 bytes. At 768 dimensions one vector is 3,072 bytes.

All values are bytes.

| Images | 512 dims | 768 dims |
|---|---:|---:|
| 2,000 | 4,096,000 | 6,144,000 |
| 50,000 | 102,400,000 | 153,600,000 |
| 1,000,000 | 2,048,000,000 | 3,072,000,000 |

## After

The cosine result was 0.0995, not 0 and not 1, because the pair is neither perpendicular nor parallel. The angle was 84.29 degrees, so the vectors are close to perpendicular but not exactly. The number matches the arithmetic: dot product 10, divided by `10.04987562112089 x 10`.

Normalizing first gave the same score. `dot(a_hat, b_hat)` and `cosineSimilarity(a, b)` both printed 0.09950371902099892. On this pair, L2 normalization turned cosine into a plain dot product. The difference was 0.

The traversal totals now match their labels. The first loop covers the first 100 files, the next loop adds files 101 to 1000, the next adds 1001 to 2000, and the last adds the remaining 316. The raw pixel bill for all 2,316 images is 1,659,670,624 bytes, about 1.55 GiB.

The embedding bill is much smaller than the raw pixel bill. At 512 dimensions, 2,000 images need 4,096,000 bytes, about 3.91 MiB. At 768 dimensions, 1,000,000 images need 3,072,000,000 bytes, about 2.86 GiB.

My width x height x 4 assumption was wrong for embeddings. That formula describes the raw RGB buffer the encoder reads. The encoder then returns a fixed-length vector, 512 floats for CLIP ViT-B/32 or 768 for SigLIP base, no matter whether the input image is 64x64 or 4K. Resolution changes how much work the encoder does, not the size of the stored vector.

The dataset has 2,316 images, not 100. The average image is about 442x391, and the average raw buffer is 716,611 bytes, or about 700 KiB. A 512-dimension embedding for the same image is 2 KiB.

## Why similar is a model opinion

My first explanation:

> The model inherently does not know that two words or two sentences are related. It relies on cosine similarity over the vectors, so it has no inherent way to see that sentence one and sentence two are similar. The similarity is not a fact but an opinion of the model. We hand the model the vectors and the cosine similarity, so what the model finds is the similarity, and it says x and y are related.

What I missed:

The model does learn a notion of similarity. It is not blind. But that notion comes from the pairs it saw during training and the loss it optimized. CLIP was trained to put an image and its matching caption close. So "similar" means close under that training signal, not close in some universal sense. A different model, or the same model trained on different data, can rank the same pair differently. A human can disagree. That makes the score the model's opinion, not a fact about the world.

One correction to my first explanation: we do not hand the model the vectors. The encoder produces them. What we choose is the training data and the objective. The geometry is learned.

## Why a better index cannot fix it

An index is a lookup structure over vectors. It does not change the vectors. Brute force compares the query with every vector and returns the closest ones. An approximate index skips comparisons to go faster. Its best possible answer is the brute-force answer. It can miss true neighbors, but it cannot move a vector closer to the query.

If the encoder puts an image far from a query, the index will return it far down the list, or miss it. A faster index does not change that distance. To change it you need a different encoder, better training data, fine-tuning, prompt changes, OCR text search, or a reranker. Those change the geometry or add a second signal. The index only changes how fast you search the geometry you already have.

| Part | Job | Can it change what similar means? |
|---|---|---|
| Encoder | turns an image or a sentence into a vector | Yes. It defines the space. |
| Index | turns a vector into candidate ids | No. It changes speed and recall. |
| Ranker | turns candidates into an order | Yes, if it uses another model or signal. |

The one measured gain a better index can give is recovering recall lost by a bad approximate index. Against exact brute force, it cannot score higher.
