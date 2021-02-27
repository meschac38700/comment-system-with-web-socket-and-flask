from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
import os
import sys
import json
from flask_cors import CORS
from app.settings import SECRET_KEY

app = Flask(__name__, template_folder="../templates",
            static_folder="../assets/", static_url_path="")
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SECRET_KEY'] = SECRET_KEY
socketio = SocketIO(app, cors_allowed_origins='*')


@socketio.on('connect')
def on_connect():
    msg = "User connected"
    emit(msg, broadcast=True)


@socketio.on('add comment event')
def on_add_comment(data=None):
    print(">>>>>>>>>>>>>>>>>>>>>>> Add", data)
    emit('add_handler_comment', data, broadcast=True)


@socketio.on('delete comment event')
def on_delete_comment(data=None):
    print(">>>>>>>>>>>>>>>>>>>>>>> Delete", data)
    emit('delete_handler_comment', data, broadcast=True)


@socketio.on('vote comment event')
def on_vote_comment(data=None):
    print(">>>>>>>>>>>>>>>>>>>>>>> Vote", data)
    emit('vote_handler_comment', data, broadcast=True)


@app.route("/")
def indexRoute():
    return render_template('index.html')


if __name__ == '__main__':
    socketio.run(app, port=5000)
