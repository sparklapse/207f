from pathlib import Path
from xml.etree import ElementTree

ROOT_DIR = Path(__file__).parent.parent
TRANSLATIONS_OUT = ROOT_DIR.joinpath("data/translations")
UCD_XML = ROOT_DIR.joinpath("data/ucd.xml")
NAMESPACE = "{http://www.unicode.org/ns/2003/ucd/1.0}"

tree = ElementTree.parse(UCD_XML)
root = tree.getroot()

for elem in root.find(NAMESPACE + "blocks").findall(NAMESPACE + "block"):
    start = elem.attrib["first-cp"].zfill(6)
    end = elem.attrib["last-cp"].zfill(6)
    name = elem.attrib["name"]
    out = TRANSLATIONS_OUT.joinpath(f"{start}-{end}.tr")

    with open(out, "w") as tr:
        tr.write(f"{start} {end} {name}\n")
