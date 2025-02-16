# Data

## Translations

Files of the translations from a character to another. The format is 6 hex digits representing the unicode character, followed by the translation terminated by a null character and new line.

> When parsing these files, make sure to split on `"\u{0}\n"` and not just new lines as a translation may include a line break.

**Example:**

```
123456out\u{0}\n
```

## ucd.xml

The official unicode database. This is mirrored from [unicode.org](https://www.unicode.org/Public/16.0.0/ucdxml/ucd.all.flat.zip).
