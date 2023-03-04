import sys
import glob
from PIL import Image

# sys.path.append('..')
from similarities.imagesim import ImageHashSimilarity, SiftSimilarity, ClipSimilarity


def sim_and_search(m):
    # print(m)
    # similarity
    sim_scores = m.similarity(imgs1, imgs2)
    print('sim scores: ', sim_scores)
    # print(zip(enumerate(image_fps1), image_fps2))
    # print("-------")
    for (idx, i), j in zip(enumerate(image_fps1), image_fps2):
        print(idx, i, j)
        print("-------")
        s = sim_scores[idx] if isinstance(sim_scores, list) else sim_scores[idx][idx]
        print(f"{i} vs {j}, score: {s:.4f}")
    # search
    m.add_corpus(corpus_imgs)
    queries = imgs1
    res = m.most_similar(queries, topn=3)
    print('sim search: ', res)
    for q_id, c in res.items():
        print('query:', image_fps1[q_id])
        print("search top 3:")
        for corpus_id, s in c.items():
            print(f'\t{m.corpus[corpus_id].filename}: {s:.4f}')
    print('-' * 50 + '\n')



# image_fps1 = ['./new_png/Activate.png', './new_png/Add.png']
# image_fps2 = ['./new_png/Add.png', './new_png/Activate.png']
image_fps1 = ['./new_png/ArrowLeft.png']
image_fps2 = ['./new_png/ButtonFilled.png']
imgs1 = [Image.open(i) for i in image_fps1]
imgs2 = [Image.open(i) for i in image_fps2]
corpus_fps = glob.glob('./new_png/*.png')
corpus_imgs = [Image.open(i) for i in corpus_fps]

# 2. image and image similarity score
sim_and_search(ClipSimilarity())  # the best result
sim_and_search(ImageHashSimilarity(hash_function='phash'))
sim_and_search(SiftSimilarity())