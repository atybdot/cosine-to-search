# Checklist

Tick a box when you can do the thing cold, without notes. Reading is not progress. A number, a running script, or a written explanation is.

Every stage has a build gate. Do not move on until you have built it. If a stage has no build gate, it is input only and you cap it at 30 minutes.

Time estimates assume evenings and weekends. Total is 5 to 8 weeks part time. Video is the long stage.

---

## Stage 0: setup (30 min)

- [ ] Create a lab repo separate from this folder, with Node 20+, TypeScript, and `@huggingface/transformers` installed.
- [x] Create `data/images/` with 100 images from your own domain (memes, movie stills, screenshots). Names stable, no spaces.
- [x] Write a script that walks the folder and prints file size and dimensions for each image. It should not crash on a webp.
- [ ] Decide where vectors will live for now. A `.bin` file plus a JSON sidecar is enough. No database yet.

Build gate: add an image to the folder and see it listed.

---

## Stage 1: vectors and cosine (2 hours)

The whole field rests on one trick. An image and a sentence become points in the same space, and "similar" means a small angle.

- [x] Write cosine similarity yourself, about 20 lines, no libraries. Test it on two hand-made vectors where you know the answer.
- [x] Prove to yourself that for L2-normalized vectors, cosine similarity equals the dot product. This is why every codebase you read just calls `dot()`.
- [x] Compute the storage bill. One vector is `dimensions x 4 bytes` in float32. Fill in 2k, 50k, and 1M images at 512 and 768 dimensions.
- [x] Explain in writing why "similar" is a model opinion, not a fact. Search quality is the model's definition of similar, and a better index cannot fix that.

---

## Stage 2: contrastive learning and InfoNCE (3 hours)

- [ ] Watch the 5 minute contrastive learning explainer.
- [ ] Read sections 1 and 2 of Lilian Weng's post. Stop when it starts listing every loss variant.
- [ ] Build a 4x4 similarity matrix from made-up numbers. Implement InfoNCE over rows and columns in about 15 lines. Print the loss with a strong diagonal and with a scrambled diagonal.
- [ ] Change the toy batch size from 4 to 16 and note what happens to the loss.
- [ ] Write out InfoNCE in your own words: a batch of image-text pairs forms a similarity matrix, the diagonal should be high, everything else low, and the loss is cross-entropy over rows and columns.

Build gate: explain why bigger batches give the model more negatives per step, without notes.

---

## Stage 3: CLIP, SigLIP, and a running model (1 day)

- [ ] Watch the friendly CLIP video.
- [ ] Read the OpenAI CLIP blog post. Read the examples and the zero-shot section, skip the benchmark table.
- [ ] Read CLIP sections 1, 2.1 to 2.4, and 3.1. Look at figure 2 until the matrix makes sense. Skip section 4 and the appendix on the first pass.
- [ ] Explain zero-shot classification with prompt templates, and why "a photo of a {}" beats "{}". This is the same mechanism as search with one class per query.
- [ ] Load CLIP ViT-B/32 in Node with Transformers.js. Embed one image, print the shape. Expect 512.
- [ ] Watch out for the trap: the `feature-extraction` pipeline gives hidden states, not the projected embedding. Use `CLIPVisionModelWithProjection` and `CLIPTextModelWithProjection`, or assert the dimension and fail loudly.
- [ ] Embed 10 images and 3 queries. Print the 10x3 similarity matrix. Look at it. Find the one mismatch and explain it.
- [ ] Confirm the model outputs are not normalized and you must L2-normalize before dot product. Check the code, don't assume.
- [ ] Swap to SigLIP base (768 dims) and run the same matrix. Note which pairs changed order.
- [ ] Read SigLIP sections 1 to 4 if the loss section is not clear. The point: the sigmoid loss judges every pair independently instead of taking a softmax over the batch.
- [ ] Measure throughput: images per second on CPU, batched and unbatched. Note the ratio.
- [ ] Find the 77 token limit and hit it. Send a 200 word query, see what survives, and write it in your notes.
- [ ] Watch Yannic Kilcher's CLIP walkthrough after the paper, as a check on what you missed. Optional.

Build gate: a script that turns an image and a sentence into one similarity score.

---

## Stage 4: brute force search (half a day)

Do this before touching an index library. It is about 30 lines and it sets the baseline every later claim is measured against.

- [ ] Build the index in memory: an array of `Float32Array`, all normalized.
- [ ] Implement top-k without sorting everything. A partial selection or a k-sized heap is enough.
- [ ] Search 100 images with 20 queries. Print p50 and p95 latency.
- [ ] Compare against the naive full sort. Confirm the fast path and know the gap.
- [ ] Look at the score distribution across queries. A good match might score 0.31 for one query and 0.22 for another. Absolute scores are not comparable across queries, so a fixed threshold is a trap.
- [ ] Add a threshold anyway, watch it fail on one query, and write down why.

Build gate: type a sentence, see images come back in under a second, and know your latency number. Screenshot it.

---

## Stage 5: evaluation (1 day)

This is the stage people skip, and it is the one that makes everything else real. It comes before the approximate index because you need a score before you can call a change an improvement.

- [ ] Write 40 queries with the ids of the images that should match. Mix three kinds: easy concepts ("dog"), hard descriptions ("guy explaining something while the chart is wrong"), and text-in-image ("distracted boyfriend").
- [ ] Implement Recall@1, Recall@5, Recall@10, MRR, and nDCG@10. Know what each one punishes.
- [ ] Build `score.ts` that takes a model plus an index and prints one table row. Any change gets re-scored with one command.
- [ ] Record the baseline with the date, model, and dimension in `notes/`.
- [ ] Compute what a random ranker scores on your set. That is the floor, and it is higher than people expect.
- [ ] Split the 40 queries into dev and test halves. Tune only on dev. Report on test.
- [ ] Break results down by query type. The aggregate number will hide that text-in-image queries are terrible.

Build gate: you can say "Recall@10 is 0.62" about your own system and defend the number.

---

## Stage 6: approximate search (1 day)

Now you are allowed to optimize, because stage 5 gave you a measuring stick.

- [ ] Read HNSW sections 1 to 3. The idea is layers plus greedy descent, and the rest is proofs you can skip.
- [ ] Watch the HNSW explainer. Then, if you want the implementation, the Faiss walkthrough. Optional.
- [ ] Before writing code, draw the layers and explain greedy descent on paper. If you cannot, reread section 2.
- [ ] Run one library: hnswlib in Python, or sqlite-vec, or LanceDB. Not all three.
- [ ] Swap it in behind the same search interface as brute force.
- [ ] Measure recall@10 against brute force at `M=16` with `efSearch` at 40, 100, and 200. Tabulate recall and latency for each.
- [ ] Explain what `M`, `efConstruction`, and `efSearch` each trade. Say which one you would turn first under a latency budget.
- [ ] Note what deletions do to an HNSW graph, and why rebuilding is often the answer.
- [ ] Pick a store. sqlite-vec or LanceDB for the simplest local setup, Qdrant if you want a server with a good TS client, pgvector if Postgres is already your thing. Write two sentences on why. Do not benchmark four.
- [ ] Optional: try int8 or binary quantization and report the recall hit.

Build gate: a table with recall and latency, and a store choice you can defend.

---

## Stage 7: hybrid search (1 to 2 days)

Memes and stills are full of text. Dense vectors are bad at exact strings, and BM25 is bad at "sad". Combining them is the cheapest quality jump available.

- [ ] OCR every image with Tesseract. Store the text next to the vector. Look at the garbage output and accept it.
- [ ] Build BM25 over that text, or use SQLite FTS5 which gives it to you. Query it alone and find three queries where it beats vectors.
- [ ] Fuse the two ranked lists with reciprocal rank fusion, `score = sum 1/(k + rank)` with `k=60`. RRF works on ranks, so you never normalize two incompatible score scales. That is the whole point.
- [ ] Measure vector, text, and hybrid on the same 40 queries, split by query type. Write down where hybrid hurts. It will hurt somewhere.
- [ ] Add a metadata filter (year, aspect ratio) and see how it interacts with ANN recall. Filtering before versus after the graph search is a real decision with a real recall cost.
- [ ] Optional: generate captions with a small VLM, embed the captions, and compare against image embeddings.

Build gate: hybrid wins on at least one query type and you can name the type where it loses.

---

## Stage 8: the image search prototype (1 weekend)

- [ ] Ingest 2k to 5k images. Persist vectors so restarts are instant. Support adding images without a full rebuild.
- [ ] Build the UI: query box, grid of results, scores, and a panel showing which text or region matched.
- [ ] Measure end to end latency: query embed, search, render. Warm target under 200 ms.
- [ ] Handle the boring failures: empty query, zero results, a 12 MB PNG, unicode filenames, and one corrupt file that should not kill the ingest.
- [ ] Write a README with your numbers, not adjectives.
- [ ] Draft the blog post while the details are fresh. One claim per section, every claim backed by your log.

Build gate: someone else can run it from the README and get the same results.

---

## Stage 9: video clips (1 to 2 weeks)

Image search plus two steps: cut the video into shots, then pool frames into one vector per shot. Keep the timestamps.

- [ ] Install ffmpeg and PySceneDetect. Cut three videos into shots. Look for over-splitting in fast cuts and under-splitting in slow pans.
- [ ] Decide the keyframe: first frame, middle frame, or sharpest frame. Try two and compare.
- [ ] Build the cheap baseline first: one embedding per shot from one keyframe, stored as `(vector, video_id, start, end)`.
- [ ] Query, render results with timestamps, click one, play from that second. Verify the jump lands where you expect. Off-by-a-GOP bugs are normal here.
- [ ] Read CLIP4Clip. Focus on frame sampling and on mean pooling versus the sequential variants.
- [ ] Then try 8 to 12 uniformly sampled frames per shot with max or mean pooling at query time. Measure the delta against the baseline.
- [ ] Dedupe near-identical adjacent shots. A talking head becomes 40 shots that all match.
- [ ] Evaluate with clip-level Recall@K on 20 queries. Reuse your scoring harness.
- [ ] Optional: action and temporal queries ("person walks in, then sits"). Find where single-vector-per-shot falls apart.

Build gate: search a folder of videos by description and land on the right second.

---

## Optional directions, pick at most one

- [ ] Fully in browser: Transformers.js on WebGPU, vectors in IndexedDB or sqlite-vec compiled to wasm, model cache warm start measured.
- [ ] SigLIP 2 for multilingual queries. Worth it if your corpus has non-English text.
- [ ] Rerank the top 50 with a larger model or a VLM. Measure the quality gain against the latency cost.
- [ ] Late interaction, ColPali style, if text inside images dominates your corpus.
- [ ] A real video encoder instead of CLIP on frames, if clip retrieval becomes the main product.

---

## Self test

If you can answer these without notes, you are done with the image half.

1. Why does L2 normalization turn cosine into a dot product?
2. What does the temperature in InfoNCE control?
3. Why does SigLIP's loss work better than CLIP's at small batch sizes?
4. What happens to a 200 word query when it hits CLIP's text encoder?
5. When is brute force the correct answer, and what is the number on your machine?
6. What does `efSearch` trade away?
7. Why can't you compare raw similarity scores across two different queries?
8. What does Recall@10 miss that nDCG@10 catches?
9. Why does reciprocal rank fusion avoid score normalization?
10. Why does one vector per shot fail on "walks in, then sits"?

---

## Experiment log

Keep this current. The blog post assembles itself from this table.

| Date | Change | Recall@10 | p95 latency | Notes |
|---|---|---|---|---|
| | baseline: CLIP B/32, brute force | | | |
| | | | | |
| | | | | |
| | | | | |

---

## Progress

- [ ] Stages 0 to 3 done, a model runs locally
- [ ] Stage 4 done, there is a working search box
- [ ] Stage 5 done, there is a baseline number
- [ ] Stages 6 to 7 done, the optimization is measured
- [ ] Stage 8 done, the prototype works
- [ ] Stage 9 done, video clips searchable
- [ ] Blog post drafted
- [ ] Project direction chosen
