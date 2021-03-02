import sqlite3
from flask import g
from app import settings

DB_PATH = getattr(settings, 'DATABASE', './database.db')

DEFAULT_COMMENTS = [
    {
        "children": [],
        "parent": {
            "author_firstname": "Frederic",
            "nbr_vote": 0,
            "author_lastname": "Doe",
            "added": "1594771200000",
            "id": 1,
            "content": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur ratione omnis alias magnam? Consectetur, dignissimos!",
        },
    },
    {
        "children": [
            {
                "parent_id": 2,
                "author_firstname": "Aymen",
                "nbr_vote": 0,
                "author_lastname": "Doe",
                "added": "1594822984000",
                "id": 3,
                "content": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur ratione omnis alias magnam?",
            },
            {
                "parent_id": 2,
                "author_firstname": "Jeremy",
                "nbr_vote": 0,
                "author_lastname": "Doe",
                "added": "1594857600000",
                "id": 4,
                "content": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur ratione omnis alias magnam?",
            },
            {
                "parent_id": 2,
                "author_firstname": "Thierry",
                "nbr_vote": 1,
                "author_lastname": "Doe",
                "added": "1594807270000",
                "id": 5,
                "content": "Last comment on the first parent comment",
            },
        ],
        "parent": {
            "author_firstname": "Eliam",
            "nbr_vote": 3,
            "author_lastname": "Doe",
            "added": "1594822846000",
            "id": 2,
            "content": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur ratione omnis alias magnam? Consectetur, dignissimos! Officia debitis iste libero omnis porro facilis architecto! Officia corrupti cum vitae laborum minus exerci",
        },
    },
]


def dict_factory(cursor, row):
    """Make db return list of dict instead of tuple
    Args:
        cursor
        row
    Returns:
        List(Dict()): Query result
    """
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


class Database():

    def __init__(self):
        self.get_db.execute("""CREATE TABLE IF NOT EXISTS comments(
            id integer PRIMARY KEY,
            parent_id integer,
            author_lastname text not null,
            author_firstname text not null,
            content text not null,
            nbr_vote integer not null,
            added text,
            FOREIGN KEY (parent_id) REFERENCES comments (id) ON DELETE CASCADE
        );""")
        if len(self.query_db("SELECT * FROM comments")) == 0:
            # loaded default comments
            for c in DEFAULT_COMMENTS:
                self.insert_query("""INSERT INTO comments(
                author_firstname,
                nbr_vote,
                author_lastname,
                added,
                id,
                content)
                VALUES(?,?,?,?,?,?)
                """, list(c['parent'].values()))

                if len(c['children']) > 0:
                    for child in c['children']:
                        self.insert_query("""
                        INSERT INTO comments(
                            parent_id,
                            author_firstname,
                            nbr_vote,
                            author_lastname,
                            added,
                            id,
                            content)
                        VALUES(?,?,?,?,?,?,?)
                        """, list(child.values()))

    @ property
    def get_db(self):
        db = getattr(g, '_database', None)
        if db is None:
            db = g._database = sqlite3.connect(DB_PATH)
        db.row_factory = dict_factory
        return db

    def query_db(self, query, args=(), one=False):
        cur = self.get_db.execute(query, args)
        rv = cur.fetchall()
        cur.close()
        return (rv[0] if rv else None) if one else rv

    def insert_query(self, query, data=()):
        conn = self.get_db
        cur = conn.cursor()
        cur.execute(query, data)
        conn.commit()
        return cur.lastrowid

    def update_query(self, query, data=()):
        conn = self.get_db
        cur = conn.cursor()
        cur.execute(query, data)
        conn.commit()
        return cur.rowcount
