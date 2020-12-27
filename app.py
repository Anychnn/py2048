from flask import Flask, request, render_template, redirect, url_for, abort, jsonify, make_response
import os
import numpy as np
from gym_2048 import Game2048Env
from dqn_agent import DQN
from utils import log2_shaping

env = Game2048Env()

app = Flask(__name__, static_folder="static", static_url_path="/static")

agent = DQN(num_state=16, num_action=4)
agent.load(path='./save/', name='dqn_9017.pkl')


# @app.route('/1')
# def hello_world():
#     with open('./templates/index.html', encoding='utf-8')as f:
#         text = f.read()
#     return text


@app.route('/')
def hello_world2():
    with open('./templates/py2048.html', encoding='utf-8')as f:
        text = f.read()
    return text


@app.route('/move', methods=['POST'])
def tile_move():
    json = request.get_json()

    dict_items = json['items']
    direction = json['direction']

    items = []
    for item in dict_items:
        items.append(item['value'])

    pack = env.step(direction)
    state, reward, done, info = pack
    print("---------------------------------")
    res = {'changed': True, 'items': state.flatten().tolist(), 'lose': done, "score": env.score,
           "best_score": env.best_score}
    return jsonify(res)


@app.route('/init', methods=['POST'])
def init2():
    state, reward, done, info = env.reset()
    res = {'changed': True, 'items': state.flatten().tolist(), 'lose': done, "score": env.score,
           "best_score": env.best_score}
    return jsonify(res)


@app.route('/auto', methods=['POST'])
def auto_select():
    json = request.get_json()

    dict_items = json['items']
    direction = json['direction']

    action = agent.select_action(log2_shaping(env.Matrix), deterministic=True)
    state, reward, done, info = env.step(action)
    # print(env.score)
    if done:
        print(env.Matrix)

    res = {'changed': True, 'items': state.flatten().tolist(), 'lose': done, 'score': env.score,
           "best_score": env.best_score}
    # res = {'action': action}
    res = jsonify(res)
    return res


if __name__ == '__main__':
    app.run()
