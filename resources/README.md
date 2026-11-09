# Resources

This is the catalog. The order you actually work in is `../PACKLIST.md`. The phases here are in the same order as the packlist. The numbers belong to this file only.

The list is core first. You learn how CLIP compares a sentence to an image and you build a working search before you touch a single optimization paper. Approximate indexes, quantization, and hybrid search come after you can measure recall. Reading about HNSW before you have a brute force baseline is how people end up with opinions and no numbers.

You do not need to finish everything. Stopping after item 11 still leaves you able to build and evaluate a real image search engine.

## How to read a paper

Three passes. First pass: title, abstract, figures, conclusion. Ten minutes, and it tells you whether to continue. Second pass: intro and method, skip experiments. Third: the parts you need for the thing you are building.

Most of these papers are written for reviewers, not for you. Skipping the proofs is not cheating.

## The papers

`PAPERS.md` has every title, page count, and link. The PDFs are not in the repo, since they are 14 MB you can download whenever you need them. Put them in `papers/` if you want them offline. That folder is ignored by git.

What each one is for, in one line:

| Paper | Pages | What it is |
|---|---|---|
| CLIP | 48 | Read about 12 pages of it. |
| SigLIP | 17 | The better default encoder |
| HNSW | 13 | The index most vector DBs use |
| Faiss | 12 | Optional but good on IVF and PQ |
| IR book, ch. 6 | 26 | Scoring and the vector space model |
| IR book, ch. 8 | 25 | Evaluation. The most useful chapter here. |
| IR book, ch. 11 | 17 | Probabilistic retrieval and BM25 |
| CLIP4Clip | 14 | Text to video clip retrieval |
| SigLIP 2 | 20 | Optional, multilingual and denser features |

---

## Phase 1: the core idea

Build in this phase. Everything here exists to get one working search box, not to survey the field.

1. **Cosine similarity, by hand.** No link. Write it yourself in about 20 lines. Test on `[1,0]` against `[0,1]` and against `[2,0]`. If you cannot explain why normalized dot equals cosine, the rest of the project will feel like magic.

2. **Contrastive Learning, 5 minutes with Cyrill Stachniss.** [youtube.com/watch?v=sftIkJ8MYL4](https://www.youtube.com/watch?v=sftIkJ8MYL4)
   Watch first. Five minutes, no math panic, gets the "pull matching pairs together" idea in your head before the paper complicates it. This is the one video you are allowed to watch before writing the loss.

3. **Lilian Weng, Contrastive Representation Learning.** [lilianweng.github.io/posts/2021-05-31-contrastive](https://lilianweng.github.io/posts/2021-05-31-contrastive/)
   Read sections 1 and 2. Stop when it starts listing every loss variant. The point is the objective, not the taxonomy.

4. **Computerphile, How AI "Understands" Images (CLIP).** [youtube.com/watch?v=KcSXcpluDe4](https://www.youtube.com/watch?v=KcSXcpluDe4)
   The friendly version. Good before the paper. If you have already read the paper, skip it. One introductory video is enough.

5. **OpenAI, CLIP: Connecting text and images.** [openai.com/index/clip](https://openai.com/index/clip/)
   Short blog post. Read the examples and the zero-shot section, skip the benchmark table.

6. **CLIP paper.** `papers/01-clip-2103.00020.pdf`, also [arxiv.org/abs/2103.00020](https://arxiv.org/abs/2103.00020)
   Read 1, 2.1 to 2.4, and 3.1. Look at figure 2 until the matrix makes sense. Skip section 4 and the appendix on the first pass. Twelve pages carry the idea.

7. **Transformers.js docs.** [huggingface.co/docs/transformers.js](https://huggingface.co/docs/transformers.js)
   The API reference is the part you will use. Know `pipeline`, `AutoProcessor`, and the `device` option. Read the API section, not the tutorials.

8. **Model pages you will actually load.** [Xenova/clip-vit-base-patch32](https://huggingface.co/Xenova/clip-vit-base-patch32), [Xenova/siglip-base-patch16-224](https://huggingface.co/Xenova/siglip-base-patch16-224)
   These hold the ONNX conversions. Check the file sizes before you plan anything browser based. A quantized encoder lands in the low hundreds of megabytes.

9. **Yannic Kilcher, OpenAI CLIP paper explained.** [youtube.com/watch?v=T9XSU0pKX2E](https://www.youtube.com/watch?v=T9XSU0pKX2E)
   After the paper. Use it to find what you misread. Long, watch at 1.5x. Optional if the matrix already makes sense.

10. **SigLIP paper.** `papers/02-siglip-2303.15343.pdf`, also [arxiv.org/abs/2303.15343](https://arxiv.org/abs/2303.15343)
    Sections 1 to 4, and only if you plan to use it. You are looking for one thing: the sigmoid loss replaces the softmax over the batch, so every pair is judged independently. That is why it trains well at small batch sizes.

11. **Lucas Beyer, Sigmoid Loss for Language Image Pre-Training (Cohere).** [youtube.com/watch?v=Nk9YnMHB6hU](https://www.youtube.com/watch?v=Nk9YnMHB6hU)
    The author explaining the paper. Watch if the loss section felt hand-wavy. Do not watch it as a substitute for reading the section.

**Stop after 11.** You should have a brute force search over your own images. If you do not, the next resources will not help. Go build.

---

## Phase 2: measurement

12. **IR book, chapter 8, evaluation.** `papers/05-manning-ch08-evaluation.pdf`
    The most valuable reading in this list. Precision, recall, rank-based measures, and why a test collection with judgements is the only way to know anything. Read it twice.

**Stop after 12.** Score your brute force search before you read a single optimization paper.

---

## Phase 3: optimization

Only open these after your baseline number exists.

13. **HNSW paper.** `papers/03-hnsw-1603.09320.pdf`, also [arxiv.org/abs/1603.09320](https://arxiv.org/abs/1603.09320)
    Sections 1 to 3. Layers, greedy descent, `M`, `efConstruction`, `efSearch`. The proofs are not your problem.

14. **DataMListic, HNSW explained.** [youtube.com/watch?v=77QH0Y2PYKg](https://www.youtube.com/watch?v=77QH0Y2PYKg)
    Best visual explanation of the graph structure. Watch after the paper if section 2 felt abstract. Do not watch both this and the Faiss video before writing code.

15. **James Briggs, HNSW with Faiss.** [youtube.com/watch?v=QvKMwLjdK-s](https://youtube.com/watch?v=QvKMwLjdK-s)
    Optional. Useful if you want to see parameters changed live and watch recall respond.

16. **Faiss paper.** `papers/04-faiss-1702.08734.pdf`, also [arxiv.org/abs/1702.08734](https://arxiv.org/abs/1702.08734)
    Optional, 12 pages. Read the IVF and product quantization sections. This is what you reach for at millions of vectors, and PQ is the idea behind every "fits in RAM" claim.

17. **Pick one store, read only its quickstart.**
    - sqlite-vec: [github.com/asg017/sqlite-vec](https://github.com/asg017/sqlite-vec). One file, runs in the browser via wasm.
    - LanceDB: [lancedb.com/docs](https://lancedb.com/docs). Columnar, good TS client, handles data that does not fit in memory.
    - Qdrant: [qdrant.tech/documentation](https://qdrant.tech/documentation). A real server, good filtering, nice TS client.
    - pgvector: [github.com/pgvector/pgvector](https://github.com/pgvector/pgvector). If Postgres is already in your stack, this is the boring correct answer.

    Do not evaluate four. Read one quickstart, build the thing, move on.

18. **IR book, chapter 6, scoring and the vector space model.** `papers/05-manning-ch06-scoring.pdf`
    Skim. You want the tf-idf and cosine framing, and to see that information retrieval had this problem decades before embeddings.

19. **IR book, chapter 11, probabilistic retrieval and BM25.** `papers/05-manning-ch11-bm25.pdf`
    Read the BM25 derivation loosely and the parameters carefully. Then you will understand why `k1` and `b` exist.

20. **Tejas Kumar, BM25 and hybrid search.** [youtube.com/watch?v=lD3_VF5bmWg](https://www.youtube.com/watch?v=lD3_VF5bmWg)
    Practical framing of why lexical search still wins on exact strings, which is exactly your meme problem.

21. **Tesseract docs.** [tesseract-ocr.github.io](https://tesseract-ocr.github.io/)
    You need the CLI and one flag set. Do not read the whole site.

22. **Reciprocal rank fusion, Cormack et al. 2009.** [doi.org/10.1145/1571941.1572114](https://doi.org/10.1145/1571941.1572114)
    Paywalled, and you only need the formula: `score = sum 1/(k + rank)`, `k=60`. The important property is that it uses ranks, so you never normalize two incompatible score scales.

---

## Phase 4: the prototype

23. **The official semantic image search example.** [github.com/huggingface/transformers.js-examples/tree/main/semantic-image-search-web](https://github.com/huggingface/transformers.js-examples/tree/main/semantic-image-search-web)
    Read this after you have written your own version, not before. Otherwise you copy the shape without understanding the choices.

24. **The WebGPU CLIP example.** [github.com/huggingface/transformers.js-examples/tree/main/webgpu-clip](https://github.com/huggingface/transformers.js-examples/tree/main/webgpu-clip)
    Optional. This is the browser direction, if you go there.

25. **Supabase, Image Search in Python with OpenAI CLIP.** [youtube.com/watch?v=S7VZErcTN5Y](https://www.youtube.com/watch?v=S7VZErcTN5Y)
    Python, but the pipeline shape is identical. Watch for the pgvector part and the way they batch embeddings.

26. **Zero-shot image classification task page.** [huggingface.co/tasks/zero-shot-image-classification](https://huggingface.co/tasks/zero-shot-image-classification)
    Important because zero-shot classification and text-to-image search are the same operation with different labels. Once you see that, CLIP stops being mysterious.

---

## Phase 5: video

27. **PySceneDetect.** [scenedetect.com](https://www.scenedetect.com/)
    Content detector and threshold detector. Start with content, tune the threshold on your own footage, and accept that shot detection is never perfect.

28. **CLIP4Clip paper.** `papers/06-clip4clip-2104.08860.pdf`, also [arxiv.org/abs/2104.08860](https://arxiv.org/abs/2104.08860)
    Sections 1 to 3, then the results tables for mean pooling versus sequential. The takeaway is that mean pooling over frames is a strong, cheap baseline that most fancy methods struggle to beat.

29. **Hyeongmin Lee, CLIP4Clip paper review.** [youtube.com/watch?v=b543xivGRnI](https://www.youtube.com/watch?v=b543xivGRnI)
    A clear walkthrough of the three similarity schemes. Watch after the paper, or instead of sections 2 and 3.

30. **TransNetV2.** [github.com/soCzech/TransNetV2](https://github.com/soCzech/TransNetV2)
    Optional. A learned shot boundary detector. Use it only if PySceneDetect keeps failing on your footage.

---

## Optional, if the project goes further

31. **SigLIP 2.** `papers/07-siglip2-2502.14786.pdf`, also [arxiv.org/abs/2502.14786](https://arxiv.org/abs/2502.14786)
    Optional. Read the abstract and the list of improvements. Worth it only if you need multilingual queries or better dense features.

32. **IBM, What is a vector database.** [youtube.com/watch?v=gl1r1XV0SLw](https://www.youtube.com/watch?v=gl1r1XV0SLw)
    Marketing-adjacent, but a decent vocabulary primer if you have to explain this to someone else.

33. **Hugging Face, We shipped 207 WebGPU kernels for browser AI.** [youtube.com/watch?v=y9xup6XEP2o](https://www.youtube.com/watch?v=y9xup6XEP2o)
    Relevant if the browser plan becomes real. Explains what actually gets fast on WebGPU and what does not.

34. **Deepia, Contrastive Learning with SimCLR, animated.** [youtube.com/watch?v=UqJauYELn6c](https://www.youtube.com/watch?v=UqJauYELn6c)
    Optional. Better visuals than the 5 minute version if you want one more pass at the idea. This is the third video on the same concept. Watch it only if the loss still does not click.

35. **ColPali.** [arxiv.org/abs/2407.01449](https://arxiv.org/abs/2407.01449)
    Optional and later. Late interaction over image patches. Read only if text inside images turns out to dominate your corpus.
