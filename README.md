# Système de commentaire avec Flask et le Web Socket

Système de commentaire utilisant le webSocket.
La persistance des données n'est que temporaire dû à la base de données sqlite et l'hébergeur Heroku.

# Requirements

Python >= v3.9

## Demo
https://comment-with-flask-websocket.herokuapp.com/

## Installation

Cloner le projet

```bash
git clone https://github.com/meschac38700/comment-system-with-web-socket-and-flask.git
```

Deplacez vous dans la branche 'local' si ce n'est pas déjà le cas

```bash
git checkout local
```

Se placer dans le répertoire du projet

```bash
cd comment-system-with-web-socket-and-flask
```

Créer à la racine du projet le fichier database.db

```bash
touch database.db
```

Créer à la racine du projet le fichier settings.py et spécifier les variables listées dans settings.py.example

```bash
touch settings.py
```

Créer l'environnement virtuel

```bash
python -m venv {nom_environnement_virtuel}
```

Activer l'environnement virtuel (Linux, Mac OS)

```bash
source {nom_environnement_virtuel}/bin/activate
```

Activer l'environnement virtuel (Windows)

```bash
bash ./{nom_environnement_virtuel}/Scripts/activate.bat
```

Utiliser le gestionnaire de dépendances [pip](https://pip.pypa.io/en/stable/) pour installer les dependances présentes dans le fichier requirements.txt.

```bash
pip install -r requirements.txt
```

## Lancer le programme

Executer la commande suivante pour lancer le serveur:

```bash
python main.py
```

Allez sur: http://127.0.0.1:5000/

## License

[MIT](https://choosealicense.com/licenses/mit/)
