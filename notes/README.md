# Notes

One file per stage, named `01-vectors.md`, `02-contrastive.md`, `03-clip.md`, and so on. Copy `000-template.md` to start one.

The rule that makes these notes useful later: write the prediction before you run the experiment, and the number after. "I thought SigLIP would be better" is worth nothing. "I expected Recall@10 to go from 0.62 to 0.70 and it went to 0.66" is a paragraph in a blog post.

What to capture, in this order of value:

1. Numbers you measured, with the date and the hardware.
2. Surprises, especially the ones that made you change your plan.
3. Explanations you had to work for. If it took twenty minutes to understand, it will take a reader twenty minutes too, and that is your best material.
4. Dead ends, briefly. "Tried binary quantization, lost 18 points of recall" saves someone a weekend.

What not to capture: definitions you copied, links without a note on why, and anything you did not run yourself.

Rough blog post shape, if you want one now:

- The claim the post makes, in one sentence.
- What the naive version does, with your own numbers.
- The thing that broke, and why it breaks for everyone, not just you.
- What fixed it, with the before and after.
- What is still bad. This is the section people trust.
