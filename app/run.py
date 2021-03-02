from flask import Flask, render_template, g
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from app.models import Database
from app import settings
app = Flask(__name__, template_folder="/templates/",
            static_folder="/assets/", static_url_path="")
with app.app_context():
    DB = Database()

app.config['SECRET_KEY'] = getattr(settings, 'SECRET_KEY', 'mySecretKey')
cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, logger=True, engineio_logger=True)


@socketio.on('connect')
def on_connect():
    res = DB.query_db("""
        SELECT *
        FROM comments
        ORDER BY id DESC
        LIMIT 20;
    """)
    emit("load_comments", res, broadcast=True)


@socketio.on('add comment event')
def on_add_comment(data=None):
    comment_id = DB.insert_query("""INSERT INTO comments(
        parent_id,
        content,
        nbr_vote,
        added,
        author_lastname,
        author_firstname)
        VALUES(?,?,?,?,?,?)
        """, (
        data.get('parent_id', None),
        data['content'],
        data['nbr_vote'],
        data['date_added'],
        'DOE',
        'John',
    ))
    data['id'] = comment_id
    print(">>>> Add", data)
    emit('add_handler_comment', data, broadcast=True)


@socketio.on('delete comment event')
def on_delete_comment(data=None):
    print(">>>> Delete", data)
    emit('delete_handler_comment', data, broadcast=True)


@socketio.on('vote comment event')
def on_vote_comment(data=None):
    DB.update_query(
        "UPDATE comments SET nbr_vote = ? WHERE id = ?", (
            data['nbr_vote'],
            data['comment_id'],
        )
    )
    print("DEBUG UPDATE", "data", data)
    print(">>>> Vote", data)
    emit('vote_handler_comment', data, broadcast=True)


@app.route("/")
def indexRoute():
    # db = Database()
    return render_template('index.html')


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


if __name__ == '__main__':
    socketio.run(app, port=5000, host='127.0.0.1')
