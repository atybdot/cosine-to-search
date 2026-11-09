# Image search engine

A learning workspace for text-to-image search in plain language, then the same thing over video clips.

Two outputs are on the table:

1. A blog post about how this works, written from your own measurements.
2. A search engine project, probably in the browser, maybe WebGPU. Not decided, and that is fine.

## The problem this repo solves

Reading about CLIP feels like progress. It is not. You can watch ten videos and still not have a search box. Every stage below has a build gate, and the gate comes before the next paper. If you skip the gate, the rest of the path is entertainment.

## What's here

```
image-search-engine/
├── PACKLIST.md           # the schedule, one sitting per item
├── CHECKLIST.md          # tick boxes, stage by stage
├── AGENTS.md             # how the tutor behaves
├── resources/
│   ├── README.md         # every resource, core first
│   └── PAPERS.md         # paper titles and links, PDFs stay out of git
├── notes/                # one file per stage
└── explainers/           # HTML definition pages with SVG diagrams

The meme image set and the downloaded PDFs are local only. `.gitignore` keeps
them out of the repo, so a clone stays small. `resources/PAPERS.md` has the
download links.
```

## How to use it

1. Open `PACKLIST.md`. That is the schedule. One item per sitting, top to bottom.
2. Tick `CHECKLIST.md` as you finish things.
3. Open `resources/README.md` only when the packlist sends you there.
4. Ask the tutor in this workspace for hints. The rules are in `AGENTS.md`. It will not write the solution for you.

## When to start building

Stage 1, item 1. Not after the papers. The first thing you write is cosine similarity, before you read anything about CLIP.

## When to stop watching

One video per concept. If you have watched two videos on the same idea, stop and build.

Cap input at 45 minutes for any stage that has a build gate. If 45 minutes pass and you have not typed code, close the tab.

A second video on the same concept feels productive because the material is familiar. That is the trap. Familiarity is not recall, and neither one is a working index.

If you get stuck, ask for a hint. The hint ladder in `AGENTS.md` exists so that asking does not turn into another lecture.

## The path

| Stage | What you build | Main input | Time |
|---|---|---|---|
| 0 | A place to put images | none | 30 min |
| 1 | Cosine similarity by hand | none | 2 h |
| 2 | InfoNCE on a 4x4 matrix | one video, half a blog post | 3 h |
| 3 | A running image and text encoder | CLIP paper, API docs | 1 day |
| 4 | Brute force search over 100 images | none, build only | half a day |
| 5 | Your own labelled set and scores | IR evaluation chapter | 1 day |
| 6 | An approximate index with recall numbers | HNSW paper | 1 day |
| 7 | Text plus vector search | BM25 chapter, one video | 1 to 2 days |
| 8 | A working prototype | the HF example, after yours | 1 weekend |
| 9 | Video clip search | CLIP4Clip | 1 to 2 weeks |

Stages 1 to 8 are the image part. Stage 9 is where the folder name earns its keep.

Evaluation sits before the approximate index on purpose. You cannot tell whether an index tweak helped without a score, and recall against brute force is that score. Optimizing before you can measure is how a weekend disappears.

## Implementation gate after every stage

Each stage ends with a build gate. The gate is a deliverable you can run, not a topic you have read. This section is the short version. The packlist has the exact steps.

### Stage 0: a folder of images

Build a separate lab repo with Node 20+, TypeScript, and `@huggingface/transformers`. Put 100 images in `data/images/`. Write a walker that prints size and dimensions and survives a webp.

Done when you can add an image and see it listed.

### Stage 1: cosine from scratch

Write cosine similarity in about 20 lines with no libraries. Test it on two vectors whose answer you know. Then prove that L2-normalized cosine equals the dot product.

Compute the storage bill for 2k, 50k, and 1M images at 512 and 768 dimensions. Fill in the table yourself.

Done when you can sketch the encoder, index, and ranker on a napkin and put the right byte count on each.

### Stage 2: the loss, by hand

Build a 4x4 similarity matrix from made-up numbers. Implement InfoNCE over the rows and the columns. Run it once with a strong diagonal and once with a scrambled diagonal. Print both losses.

Change the batch size from 4 to 16 and note what happens to the loss.

Done when you can explain why bigger batches give the model more negatives per step.

### Stage 3: one encoder, one score

Load CLIP ViT-B/32. Embed one image and assert the dimension is 512. Then embed 10 images and 3 queries and print the matrix. Then swap to SigLIP base and print the same matrix.

Use the projection models, not the `feature-extraction` pipeline. That pipeline returns hidden states and will quietly give you the wrong vector.

Done when a script turns a folder of images and one sentence into one similarity score.

### Stage 4: the first search engine

Normalize every vector into memory. Implement top-k without sorting the whole list. Add a CLI query that prints the top 5 results and the latency. Add a fixed threshold, watch it fail on one query, and write down why.

Done when you can type a sentence and see images come back in under a second. Screenshot it. This is the first point where the project exists.

### Stage 5: your own numbers

Write 40 queries with the image ids that should match. Mix three kinds: easy concepts, hard descriptions, and text inside the image. Implement Recall@1, Recall@5, Recall@10, MRR, and nDCG@10. Score the baseline. Compute the random ranker's score too.

Split into dev and test halves. Tune on dev only.

Done when you can say a baseline number out loud and know what it punishes.

### Stage 6: an index, with receipts

Swap brute force for one approximate index behind the same interface. Measure recall@10 against brute force at `efSearch` 40, 100, and 200. Record latency for each.

Done when you have a table and a store choice you can defend in two sentences.

### Stage 7: text plus vector

OCR every image. Build BM25 over the text, or use SQLite FTS5. Fuse the two ranked lists with reciprocal rank fusion. Re-score on the same 40 queries, split by query type.

Done when hybrid wins on one query type and you can name the type where it loses.

### Stage 8: the prototype

Persist vectors so restart is instant. Support adding images without a full rebuild. Build the query box, the result grid, and the score panel. Measure end to end latency. Handle the boring failures: empty query, zero results, a 12 MB PNG, unicode filenames, one corrupt file.

Read the Hugging Face example now, after your own version runs. Before that it is a template to copy.

Done when someone else can run it from the README.

### Stage 9: video

Cut three videos into shots. Pick a keyframe. Build the cheap baseline: one vector per shot, stored with `(video_id, start, end)`. Query it, click a result, and verify the player lands on the right second.

Then try 8 to 12 frames per shot with mean or max pooling and measure the delta.

Done when you can search a folder of videos by description and land on the right second.

## What to do when stuck

1. Write down the exact input, the exact output, and what you expected.
2. Shrink the input until it is one image and one query.
3. Ask the tutor for a hint, not a fix.
4. If the hint does not land, ask for a definition or an explainer, not a second video.

## Scope notes

- TypeScript carries the whole build. Transformers.js runs CLIP and SigLIP through ONNX in Node and in the browser.
- Python is for reading other people's code and for notebooks. You need to read it, not write it well.
- Video is image search plus shot detection and pooling. Doing images first removes two variables from every later bug.
- Keep the lab code in a separate repo so this folder stays a notebook, not a project.

## One rule that saves weeks

Keep the labelled query set from stage 5 onward. Every model swap, every index tweak, every prompt template gets a score. Without it you will spend a weekend making search feel better while it gets worse.
