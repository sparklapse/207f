from common import ROOT_DIR, translation
from datetime import datetime

BINDINGS_OUT = ROOT_DIR.joinpath("bindings/207f.go")

script = f"""/**
  * This file was generated. The source can be found at https://github.com/sparklapse/207f
  *
  * MIT License
  *
  * Copyright (c) {datetime.now().year} Sparklapse
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  */

package t207f

import (
	"strings"
)

var translations map[rune]string

func init() \x7b
	translations = map[rune]string\x7b
{"\n".join([f'\t\t{_[0]}: "{_[1]}",' for _ in translation])}
	\x7d
\x7d

func Translate(text string, defaultTranslation ...rune) string \x7b
	dtr := rune(0x7f)
	if len(defaultTranslation) == 1 \x7b
		dtr = defaultTranslation[0]
	\x7d

	out := ""
	for _, rune := range text \x7b
		safeRune, ok := translations[rune]
		if ok \x7b
			out += safeRune
		\x7d else \x7b
			out += string(dtr)
		\x7d
	\x7d

	strings.ReplaceAll(out, string(rune(0x7f)), "")

	return out
\x7d
"""

with open(BINDINGS_OUT, "w") as binding:
    binding.write(script)
