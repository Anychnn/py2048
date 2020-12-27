import numpy as np
import random
import math

UP = 0  # Up
RIGHT = 1  # Right
DOWN = 2  # Down
LEFT = 3  # Left


# class Tile:
#     def __init__(self, dict):
#         self.x = dict['x']
#         self.y = dict['y']
#         self = dict['value']

def checkIfLose(items):
    lose = True
    np_items = np.array(items).reshape((4, 4))
    for i in range(4):
        for j in range(4):
            if np_items[i, j] == 0:
                return False

            i_tmp = i - 1
            if 0 <= i_tmp < 4:
                if items[4 * i + j] == items[4 * i_tmp + j]:
                    return False

            i_tmp = i + 1
            if 0 <= i_tmp < 4:
                if items[4 * i + j] == items[4 * i_tmp + j]:
                    return False

            j_tmp = j - 1
            if 0 <= j_tmp < 4:
                if items[4 * i + j] == items[4 * i + j_tmp]:
                    return False

            j_tmp = j + 1
            if 0 <= j_tmp < 4:
                if items[4 * i + j] == items[4 * i + j_tmp]:
                    return False

    return lose


def gen_random_tiles(items, num):
    while num > 0:
        index = random.randint(0, 15)
        if random.randint(0, 3) >= 3:
            # 1/4  =4
            if items[index] == 0:
                items[index] = 4
                num = num - 1
        else:
            if items[index] == 0:
                items[index] = 2
                num = num - 1

    return items


def move(items, direction):
    changed = False
    if direction == UP:
        for x in range(4):
            for index1 in range(4):
                if items[x + 4 * index1] == 0:
                    for index2 in range(index1 + 1, 4):
                        if items[x + 4 * index2] != 0:
                            items[x + 4 * index1] = items[x + 4 * index2]
                            items[x + 4 * index2] = 0
                            changed = True
                            break

                if items[x + 4 * index1] != 0:
                    for index2 in range(index1 + 1, 4):
                        if items[x + 4 * index2] != 0 and items[x + 4 * index2] != items[x + 4 * index1]:
                            break

                        if items[x + 4 * index2] == items[x + 4 * index1]:
                            items[x + 4 * index2] = 0
                            items[x + 4 * index1] = items[x + 4 * index1] * 2
                            changed = True
                            break
    elif direction == DOWN:
        for x in range(4):
            for index1 in range(3, -1, -1):
                if items[x + 4 * index1] == 0:
                    for index2 in range(index1 - 1, -1, -1):
                        if items[x + 4 * index2] != 0:
                            items[x + 4 * index1] = items[x + 4 * index2]
                            items[x + 4 * index2] = 0
                            changed = True
                            break

                if items[x + 4 * index1] != 0:
                    for index2 in range(index1 - 1, -1, -1):
                        if items[x + 4 * index2] != 0 and items[x + 4 * index2] != items[x + 4 * index1]:
                            break

                        if items[x + 4 * index2] == items[x + 4 * index1]:
                            items[x + 4 * index2] = 0
                            items[x + 4 * index1] = items[x + 4 * index1] * 2
                            changed = True
                            break
    elif direction == LEFT:
        for x in range(0, 4):
            for index1 in range(0, 4):
                if items[index1 + 4 * x] == 0:
                    for index2 in range(index1 + 1, 4):
                        if items[index2 + 4 * x] != 0:
                            items[index1 + 4 * x] = items[index2 + 4 * x]
                            items[index2 + 4 * x] = 0
                            changed = True
                            break

                if items[index1 + 4 * x] != 0:
                    for index2 in range(index1 + 1, 4):
                        if items[index2 + 4 * x] != 0 and items[index2 + 4 * x] != items[index1 + 4 * x]:
                            break

                        if items[index2 + 4 * x] == items[index1 + 4 * x]:
                            items[index2 + 4 * x] = 0
                            items[index1 + 4 * x] = items[index1 + 4 * x] * 2
                            changed = True
                            break
    elif direction == RIGHT:
        for x in range(0, 4):
            for index1 in range(3, -1, -1):
                if items[index1 + 4 * x] == 0:
                    for index2 in range(index1 - 1, -1, -1):
                        if items[index2 + 4 * x] != 0:
                            items[index1 + 4 * x] = items[index2 + 4 * x]
                            items[index2 + 4 * x] = 0
                            changed = True
                            break

                if items[index1 + 4 * x] != 0:
                    for index2 in range(index1 - 1, -1, -1):
                        if items[index2 + 4 * x] != 0 and items[index2 + 4 * x] != items[index1 + 4 * x]:
                            break

                        if items[index2 + 4 * x] == items[index1 + 4 * x]:
                            items[index2 + 4 * x] = 0
                            items[index1 + 4 * x] = items[index1 + 4 * x] * 2
                            changed = True
                            break

    return changed, items

# arr = np.arange(16)
# print(arr)
# gen_random_tiles(arr, 1)
# print(arr)
# gen_random_tiles(arr, 1)
# gen_random_tiles(arr, 1)
# gen_random_tiles(arr, 1)
# gen_random_tiles(arr, 1)
# gen_random_tiles(arr, 1)
# gen_random_tiles(arr, 1)
# gen_random_tiles(arr, 1)
