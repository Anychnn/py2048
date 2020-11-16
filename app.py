from flask import Flask, request, render_template, redirect, url_for, abort
import os

app = Flask(__name__, static_folder="static", static_url_path="/static")


# @app.route('/js')
# def vue():
#     print('js')
#     with open('static/js/vue.js')as f:
#         text = f.read()
#     return text
#
# @app.route('/js')
# def vue():
#     print('js')
#     with open('static/js/vue.js')as f:
#         text = f.read()
#     return text

# @app.route('/js/work.js')
# def vue():
#     with open('static/js/work.js')as f:
#         text=f.read()
#     return text


@app.route('/1')
def hello_world():
    with open('./templates/index.html')as f:
        text = f.read()
    return text
@app.route('/2')
def hello_world2():
    with open('./templates/py2048.html')as f:
        text = f.read()
    return text

if __name__ == '__main__':
    # app.run()
    pass
# print(os.getcwd())
# with open('./templates/py2048.html')as f:
#     text = f.read()
# print(text)
