# Système de commentaire avec Flask et le Web Socket

Système de commentaire utilisant le webSocket sans persistance des données.

# Requirements

Python >= v3.9

## Installation

Cloner le projet

```bash
git clone https://github.com/meschac38700/comment-system-with-web-socket-and-flask.git
```

Se placer dans le répertoire du projet

```bash
cd comment-system-with-web-socket-and-flask
```

Créer à la racine du projet le fichier database.db

```bash
touch database.db
```

Créer l'environnement virtuel

```bash
python -m venv {nom_environnement_virtuel}
```

Activer l'environnement virtuel (Linux, Mac OS)

```bash
source venv/bin/activate
```

Activer l'environnement virtuel (Windows)

```bash
bash ./venv/Script/activate
```

Utiliser le gestionnaire de dépendances [pip](https://pip.pypa.io/en/stable/) pour installer les dependances présentes dans le fichier requirements.txt.

```bash
pip install -r requirements.txt
```

## Usage

Deplacez vous dans la branch local

```bash
git checkout local
```

Executer la commande suivante pour lancer le serveur:

```bash
python main.py
```

Allez sur: http://127.0.0.1:5000/

## License

[MIT](https://choosealicense.com/licenses/mit/)
