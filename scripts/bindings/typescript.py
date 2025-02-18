from common import ROOT_DIR, translation, max_translation
from datetime import datetime

BINDINGS_OUT = ROOT_DIR.joinpath("bindings/207f.ts")

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

type Translator = Array<string> & \x7b translate: (text: string, defaultTranslation?: string) => string \x7d

export const t207f = new Array({max_translation}) as Translator;
{"\n".join([f't207f[{_[0]}] = "{_[1]}";' for _ in translation])}

t207f.translate = function(text, df = "\\u\x7b7f\x7d") \x7b
  let out = "";
  for (const c of text) \x7b
    out += this[c.charCodeAt(0)] ?? df;
  \x7d
  out.replaceAll("\\u\x7b7f\x7d", "");
  return out;
\x7d;

if (Object.freeze) Object.freeze(t207f);
"""

with open(BINDINGS_OUT, "w") as binding:
    binding.write(script)
