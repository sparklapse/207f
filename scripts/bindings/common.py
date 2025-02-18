from pathlib import Path
from glob import glob

ROOT_DIR = Path(__file__).parent.parent.parent
TRANSLATIONS = ROOT_DIR.joinpath("translations")

max_translation = 0
translation = []
for file in glob("*.trb", root_dir=TRANSLATIONS):
    with open(TRANSLATIONS.joinpath(file), "r") as book:
        start = int(book.read(6), 16)
        book.read(1)
        end = int(book.read(6), 16)
        name = book.readline()

        book_translations = book.read()
        for tr in book_translations.split("\0\n"):
            if tr == "":
                continue

            if tr[6:] == "" or tr[6:] == "\x7f":
                continue

            code = int(tr[:6], 16)
            max_translation = max(max_translation, code)
            translation.append([code, tr[6:].replace("\\", "\\\\").replace('"', '\\"')])

__all__ = ["ROOT_DIR", "translation", "max_translation"]
