# Packlist

The schedule. One item per sitting. Work top to bottom. Do not skip ahead to an optimization item because it looks interesting.

Each item is either input then build, or build only. Input has a stop point. Respect it.

Rules:

1. One video per concept. If you have watched two, stop and build.
2. Cap input at 45 minutes for any item that has a build step.
3. If you have not typed code after 45 minutes, close the tab.
4. If stuck, ask for a hint, not another resource.
5. Tick the item only when the build works on your machine.

The exact link or paper section lives in `resources/README.md`. The phases line up, so when an item says "read HNSW sections 1 to 3", that file has the URL and the stop point.

---

## Phase 1: the core idea

### 0. A place to put images

Input: done[]().

Build: a lab repo separate from this folder, with Node 20+, TypeScript, and `@huggingface/transformers`. A `data/images/` folder with 100 images you actually care about. A script that walks the folder and prints size and dimensions.

Done when: you add an image and the script lists it without crashing.

### 1. Cosine, by hand

Input: none. This item is code only.

Build: cosine similarity in about 20 lines, no libraries. Test `[1,0]` vs `[0,1]` (0), `[1,0]` vs `[2,0]` (1), and a pair you have to compute on paper. Then normalize both vectors and show the dot product gives the same number.

Also fill in the storage table: 2k, 50k, 1M images at 512 and 768 dims, float32.

Done when: you can explain why normalization turns cosine into a dot product, and say the byte counts without looking.

### 2. The loss, by hand

Watch: Cyrill Stachniss, Contrastive Learning, 5 minutes. [youtube.com/watch?v=sftIkJ8MYL4](https://www.youtube.com/watch?v=sftIkJ8MYL4)

Read: Lilian Weng, sections 1 and 2. Stop when she starts listing loss variants. [lilianweng.github.io/posts/2021-05-31-contrastive](https://lilianweng.github.io/posts/2021-05-31-contrastive/)

Build: a 4x4 similarity matrix from made-up numbers. InfoNCE over rows and columns in about 15 lines. Run it with a strong diagonal and with a scrambled diagonal. Print both losses. Then do it with a 16x16 matrix and compare.

Done when: you can explain why a bigger batch gives more negatives per step.

### 3. What CLIP actually does

Watch: Computerphile, How AI "Understands" Images. [youtube.com/watch?v=KcSXcpluDe4](https://www.youtube.com/watch?v=KcSXcpluDe4)

Read: the OpenAI CLIP blog post, examples and zero-shot section only. [openai.com/index/clip](https://openai.com/index/clip/)

Read: CLIP paper section 1, 2.1 to 2.4, and 3.1. Figure 2 until the matrix makes sense. Stop before section 4. `papers/01-clip-2103.00020.pdf`

Read: the Transformers.js API reference, only the model loading and `AutoProcessor` parts. [huggingface.co/docs/transformers.js](https://huggingface.co/docs/transformers.js)

Build: draw the two towers and the similarity matrix from memory. Then a script that embeds one image and one sentence and prints the score.

Done when: you can explain why a text tower and an image tower can share one space.

Do not read the appendix. Do not watch the Yannic video yet.

### 4. A matrix you can look at

Read: the model pages, for the file sizes. [Xenova/clip-vit-base-patch32](https://huggingface.co/Xenova/clip-vit-base-patch32), [Xenova/siglip-base-patch16-224](https://huggingface.co/Xenova/siglip-base-patch16-224)

Build: embed 10 images and 3 queries. Print the 10x3 matrix. Use the projection models, not `feature-extraction`. Assert the dimension is 512. Find the one pair that is wrong and write down why you think it failed.

Then load SigLIP base (768 dims) and print the same matrix. Note which pairs changed order.

Done when: both matrices are printed and you can name one pair that moved when you switched models.

### 5. First search engine

Input: none. Build only. No new videos.

Build: normalize every image vector into memory. Top-k without sorting the whole list. A CLI query that prints the top 5 paths and the latency. Then a fixed threshold, and one query where it fails.

Done when: you type a sentence, images come back in under a second, and you have p50 and p95 written down. Screenshot it.

This is the first real milestone. You now have a search engine. Everything after this is measurement and improvement.

---

## Phase 2: measure before optimizing

### 6. Your own test set

Read: IR book chapter 8, evaluation. First half. `papers/05-manning-ch08-evaluation.pdf`

Build: 40 queries with the ids of the images that should match. Three types: easy concept, hard description, text inside the image. Put them in a JSON or CSV file.

Done when: 40 rows exist and each one has at least one correct image id.

### 7. A score you can trust

Input: finish the IR chapter if you stopped early.

Build: Recall@1, Recall@5, Recall@10, MRR, nDCG@10. A `score.ts` that prints one row for the current model and index. A random ranker baseline. Split dev and test.

Done when: you can say "Recall@10 is X" about your own system, and you know what the random floor is.

Do not tune anything yet. This is the baseline.

---

## Phase 3: optimize, with receipts

### 8. How HNSW works, on paper

Read: HNSW paper sections 1 to 3. Stop before the proofs. `papers/03-hnsw-1603.09320.pdf`

Watch: DataMListic, HNSW explained. [youtube.com/watch?v=77QH0Y2PYKg](https://www.youtube.com/watch?v=77QH0Y2PYKg)

Build: no code. Draw the layers. Walk one query from the top layer down by hand. Write what `M`, `efConstruction`, and `efSearch` each change.

Done when: you can explain greedy descent and the three parameters without notes.

### 9. Swap the index

Input: one store quickstart only. Pick sqlite-vec, LanceDB, or hnswlib. Do not read all three.

Build: put the approximate index behind the same search interface as brute force. Measure recall@10 against brute force at `efSearch` 40, 100, and 200. Record latency for each.

Done when: a table has recall and latency at all three settings, and you can name the setting you would ship.

### 10. Shrink the vectors (optional)

Input: none.

Build: int8 or binary quantization on the same vectors. Measure the recall hit and the memory saved.

Done when: you have a number, not an opinion.

Skip this if your corpus is under 50k images.

### 11. Text inside the image

Read: IR book chapter 11, the BM25 parameters. Skim chapter 6 for the tf-idf framing.

Watch: Tejas Kumar, BM25 and hybrid search. [youtube.com/watch?v=lD3_VF5bmWg](https://www.youtube.com/watch?v=lD3_VF5bmWg)

Build: OCR every image. BM25 over the text, or SQLite FTS5. RRF to fuse the two lists. Re-score on the same 40 queries, split by query type.

Done when: hybrid wins on one type and loses on another, and you can name both.

---

## Phase 4: ship it

### 12. The prototype

Input: the official Hugging Face example, only now. [github.com/huggingface/transformers.js-examples/tree/main/semantic-image-search-web](https://github.com/huggingface/transformers.js-examples/tree/main/semantic-image-search-web)

Build: persist vectors. Add images without a full rebuild. Query box, result grid, scores. End to end latency. Empty query, zero results, a big PNG, unicode names, one corrupt file.

Done when: someone else can run it from your README.

---

## Phase 5: video

### 13. Cut video into shots

Read: PySceneDetect docs. [scenedetect.com](https://www.scenedetect.com/)

Build: cut three videos into shots. Look at the fast cuts and the slow pans. Note where it over-splits and under-splits.

Done when: you have shot lists with start and end timestamps.

### 14. One frame per shot

Input: none.

Build: one embedding per shot from the middle frame. Store `(vector, video_id, start, end)`. Query it. Render results with timestamps. Click one, play from that second.

Done when: the jump lands on the right second. Off-by-a-GOP bugs are normal here.

### 15. Read CLIP4Clip, then pool

Read: CLIP4Clip sections 1 to 3, then the pooling tables. `papers/06-clip4clip-2104.08860.pdf`

Watch: Hyeongmin Lee, CLIP4Clip review. [youtube.com/watch?v=b543xivGRnI](https://www.youtube.com/watch?v=b543xivGRnI)

Build: 8 to 12 uniformly sampled frames per shot, mean or max pooling at query time. Measure the delta against one frame.

Done when: you have the delta number.

### 16. Dedupe and evaluate

Input: none.

Build: merge near-identical adjacent shots. A talking head becomes 40 shots that all match. Then clip-level Recall@K on 20 queries, reusing your harness.

Done when: video search has a number and the duplicate wall is gone.

---

## If you only have 30 minutes today

Open the next unchecked `CHECKLIST.md` box and do it. Do not open a video. Do not open a paper. The packlist is the map, but the work is always the build step.

## If you feel behind

You are not behind. The only way to be behind is to keep consuming input without a working build. If the last three things you did were reads or watches, stop and do item 5 or 7 again with a smaller input.
