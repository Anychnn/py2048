from datetime import datetime
import tensorflow as tf
from tensorflow import keras

import numpy as np

writer = tf.summary.create_file_writer('./log')
writer.set_as_default()

scores = np.loadtxt("./data/output.txt")

for i in range(len(scores)):
    tf.summary.scalar(name='test', data=scores[i], step=i)
