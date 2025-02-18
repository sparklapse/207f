from pathlib import Path
from xml.etree import ElementTree

ROOT_DIR = Path(__file__).parent.parent
TRANSLATIONS_OUT = ROOT_DIR.joinpath("translations")
UCD_XML = ROOT_DIR.joinpath("scripts/ucd.xml")
NAMESPACE = "{http://www.unicode.org/ns/2003/ucd/1.0}"

TRANSLATIONS_OUT.mkdir(exist_ok=True)

tree = ElementTree.parse(UCD_XML)
root = tree.getroot()

repertoire = root.find(NAMESPACE + "repertoire")

for elem in root.find(NAMESPACE + "blocks").findall(NAMESPACE + "block"):
    start = elem.attrib["first-cp"].zfill(6)
    end = elem.attrib["last-cp"].zfill(6)
    name = elem.attrib["name"]
    out = TRANSLATIONS_OUT.joinpath(f"{start}-{end}.trb")

    print(f"Creating book: {name}")
    with open(out, "w", newline="") as trb:
        trb.write(f"{start} {end} {name}\n")

        for i in range(int(start, 16), int(end, 16) + 1):
            char = repertoire.find(
                NAMESPACE + f"char[@cp='{hex(i)[2:].upper().rjust(4, '0')}']"
            )

            if char is None:
                continue

            if "dm" not in char.attrib:
                continue

            dm = char.attrib["dm"]
            if dm == "#":
                continue

            tr = ""
            for norm in dm.split(" "):
                if norm == "":
                    continue

                code = int(norm, 16)
                if code > 0x7F or code < 0x20:
                    tr = None
                    break

                tr += chr(code)

            if tr is None:
                continue

            print(
                f'Adding known translation from ucd: {hex(i)[2:].upper().rjust(6, "0")} -> "{tr}"'
            )
            trb.write(f"{hex(i)[2:].upper().rjust(6, '0')}{tr}\x00\n")
