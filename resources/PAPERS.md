# Papers

Nine papers, all free to download. The PDFs are not in this repo, so a clone costs nothing and you fetch only what you read. `papers/` is ignored by git. Download a file into that folder and keep the same name if you want the links in `README.md` to keep working.

| File (local) | Paper | Pages | Link |
|---|---|---|---|
| `01-clip-2103.00020.pdf` | CLIP: Learning Transferable Visual Models From Natural Language Supervision (Radford et al., 2021) | 48 | [arxiv.org/abs/2103.00020](https://arxiv.org/abs/2103.00020) |
| `02-siglip-2303.15343.pdf` | Sigmoid Loss for Language Image Pre-Training (Zhai et al., 2023) | 17 | [arxiv.org/abs/2303.15343](https://arxiv.org/abs/2303.15343) |
| `03-hnsw-1603.09320.pdf` | Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs (Malkov, Yashunin, 2016) | 13 | [arxiv.org/abs/1603.09320](https://arxiv.org/abs/1603.09320) |
| `04-faiss-1702.08734.pdf` | Billion-scale similarity search with GPUs (Johnson, Douze, Jegou, 2017) | 12 | [arxiv.org/abs/1702.08734](https://arxiv.org/abs/1702.08734) |
| `05-manning-ch06-scoring.pdf` | Introduction to Information Retrieval, ch. 6: Scoring, term weighting, and the vector space model (Manning, Raghavan, Schutze, 2008) | 26 | [nlp.stanford.edu/IR-book/pdf/06vect.pdf](https://nlp.stanford.edu/IR-book/pdf/06vect.pdf) |
| `05-manning-ch08-evaluation.pdf` | Introduction to Information Retrieval, ch. 8: Evaluation in information retrieval | 25 | [nlp.stanford.edu/IR-book/pdf/08eval.pdf](https://nlp.stanford.edu/IR-book/pdf/08eval.pdf) |
| `05-manning-ch11-bm25.pdf` | Introduction to Information Retrieval, ch. 11: Probabilistic information retrieval | 17 | [nlp.stanford.edu/IR-book/pdf/11prob.pdf](https://nlp.stanford.edu/IR-book/pdf/11prob.pdf) |
| `06-clip4clip-2104.08860.pdf` | CLIP4Clip: An Empirical Study of CLIP for End-to-End Video Caption Matching (Luo et al., 2021) | 14 | [arxiv.org/abs/2104.08860](https://arxiv.org/abs/2104.08860) |
| `07-siglip2-2502.14786.pdf` | SigLIP 2: Multilingual Vision-Language Encoders with Improved Semantic Understanding, Localization, and Dense Features (Tschannen et al., 2025) | 20 | [arxiv.org/abs/2502.14786](https://arxiv.org/abs/2502.14786) |

The three Manning chapters come from the full book, which is free at [nlp.stanford.edu/IR-book](https://nlp.stanford.edu/IR-book/).

To fetch one:

```sh
curl -L -o resources/papers/01-clip-2103.00020.pdf https://arxiv.org/pdf/2103.00020
```

ArXiv serves the PDF at `/pdf/<id>`, the abstract page at `/abs/<id>`. Download the `/pdf/` one.
