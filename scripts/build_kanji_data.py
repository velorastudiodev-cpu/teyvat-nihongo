"""Builds src/data/{kanji,vocab}.json and src/data/strokes/*.json for N5–N1 (+ kana strokes).

Sources (credited in the app footer):
  KANJIDIC2 via github.com/davidluzgouveia/kanji-data (MIT; KANJIDIC CC-BY-SA, EDRDG). Only KANJIDIC fields are used.
  KanjiVG (CC-BY-SA 3.0, Ulrich Apel): stroke paths and components
  github.com/jamsinclair/open-anki-jlpt-decks (MIT): JLPT vocabulary
Indonesian glosses written for this app: scripts/kanji_id.tsv, scripts/vocab_id.tsv (missing entries fall back to English).
Usage: python3 -I scripts/build_kanji_data.py <cache_dir>
"""
import csv, io, json, math, os, re, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
import xml.etree.ElementTree as ET

CACHE = sys.argv[1]
HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, '..', 'src', 'data')

def fetch(url, name):
    path = os.path.join(CACHE, name)
    if not os.path.exists(path):
        with urllib.request.urlopen(url, timeout=30) as r, open(path + '.part', 'wb') as f:
            f.write(r.read())
        os.replace(path + '.part', path)
    return open(path, encoding='utf-8').read()

def tsv(name):
    path = os.path.join(HERE, name)
    if not os.path.exists(path):
        return {}
    return dict(line.rstrip('\n').split('\t', 1) for line in open(path, encoding='utf-8') if '\t' in line)

TOKEN = re.compile(r'[MmCcSsLlHhVvZz]|-?\d*\.?\d+(?:e[-+]?\d+)?')

def path_points(d):
    """Polyline approximation of an SVG path (KanjiVG uses M/C/S/L and relatives)."""
    toks, i = TOKEN.findall(d), 0
    pts, cur, start, prev_ctrl, cmd = [], (0.0, 0.0), (0.0, 0.0), None, None
    def num():
        nonlocal i
        i += 1
        return float(toks[i - 1])
    def cubic(p0, p1, p2, p3):
        for k in range(1, 11):
            t = k / 10
            pts.append(tuple((1-t)**3*a + 3*(1-t)**2*t*b + 3*(1-t)*t**2*c + t**3*e for a, b, c, e in zip(p0, p1, p2, p3)))
    while i < len(toks):
        if toks[i].isalpha():
            cmd = toks[i]; i += 1
        rel = cmd.islower()
        off = cur if rel else (0.0, 0.0)
        C = cmd.upper()
        if C == 'M':
            cur = start = (num() + off[0], num() + off[1]); pts.append(cur); prev_ctrl = None
            cmd = 'l' if rel else 'L'
        elif C == 'L':
            cur = (num() + off[0], num() + off[1]); pts.append(cur); prev_ctrl = None
        elif C == 'H':
            cur = (num() + off[0], cur[1]); pts.append(cur); prev_ctrl = None
        elif C == 'V':
            cur = (cur[0], num() + off[1]); pts.append(cur); prev_ctrl = None
        elif C == 'C':
            p1 = (num() + off[0], num() + off[1]); p2 = (num() + off[0], num() + off[1]); p3 = (num() + off[0], num() + off[1])
            cubic(cur, p1, p2, p3); prev_ctrl, cur = p2, p3
        elif C == 'S':
            p1 = (2*cur[0] - prev_ctrl[0], 2*cur[1] - prev_ctrl[1]) if prev_ctrl else cur
            p2 = (num() + off[0], num() + off[1]); p3 = (num() + off[0], num() + off[1])
            cubic(cur, p1, p2, p3); prev_ctrl, cur = p2, p3
        elif C == 'Z':
            cur = start; pts.append(cur)
    return pts

def resample(pts, n=24):
    seg = [math.dist(a, b) for a, b in zip(pts, pts[1:])]
    total = sum(seg) or 1
    out, acc, j = [pts[0]], 0.0, 0
    for k in range(1, n):
        target = total * k / (n - 1)
        while j < len(seg) - 1 and acc + seg[j] < target:
            acc += seg[j]; j += 1
        t = (target - acc) / seg[j] if seg[j] else 0
        a, b = pts[j], pts[j + 1]
        out.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
    return [[round(x), round(y)] for x, y in out]

def kanjivg(ch):
    code = f'{ord(ch):05x}'
    try:
        svg = fetch(f'https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/{code}.svg', f'kvg_{code}.svg')
    except Exception as e:
        print('no KanjiVG for', ch, e)
        return None, []
    root = ET.fromstring(re.sub(r'<!DOCTYPE[^\[]*\[.*?\]>', '', svg, flags=re.S))
    paths = sorted((p for p in root.iter('{http://www.w3.org/2000/svg}path') if '-s' in p.get('id', '')),
                   key=lambda p: int(p.get('id').rsplit('-s', 1)[1]))
    top = root.find(f".//{{http://www.w3.org/2000/svg}}g[@id='kvg:{code}']")
    parts = []
    def collect(g, depth):
        for c in g.findall('{http://www.w3.org/2000/svg}g'):
            el = next((v for k, v in c.attrib.items() if k.endswith('}element')), None)   # kvg namespace URI varies
            if el and el != ch:
                parts.append(el)
            elif depth < 2:
                collect(c, depth + 1)
    if top is not None:
        collect(top, 0)
    return {'d': [p.get('d') for p in paths], 'p': [resample(path_points(p.get('d'))) for p in paths]}, parts

def main():
    os.makedirs(CACHE, exist_ok=True)
    os.makedirs(os.path.join(OUT, 'strokes'), exist_ok=True)
    data = json.loads(fetch('https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji.json', 'kanji.json'))
    gloss = tsv('kanji_id.tsv')
    chars = [(lv, ch) for lv in (5, 4, 3, 2, 1) for ch in sorted((k for k, v in data.items() if v['jlpt_new'] == lv), key=lambda k: data[k]['freq'] or 99999)]
    kana = [chr(cp) for base in (0x3041, 0x30a1) for cp in range(base, base + 0x56) if chr(cp) not in 'ぁぃぅぇぉっゃゅょゎゐゑゕゖァィゥェォッャュョヮヰヱヵヶ']
    with ThreadPoolExecutor(16) as pool:
        vg = dict(zip([c for _, c in chars] + kana, pool.map(kanjivg, [c for _, c in chars] + kana)))

    kanji, chunks = [], {'base': {}, 'n3': {}, 'n2': {}, 'n1': {}}
    for lv, ch in chars:
        s, parts = vg[ch]
        if not s:
            continue
        v = data[ch]
        en = [m for m in v['meanings'] if 'Radical' not in m][:3]
        chunks['base' if lv >= 4 else f'n{lv}'][ch] = s
        kanji.append({'char': ch, 'level': f'N{lv}', 'strokes': len(s['d']), 'meaning': gloss.get(ch) or en[0].lower(),
                      'en': en, 'on': v['readings_on'], 'kun': v['readings_kun'], 'parts': list(dict.fromkeys(parts))})
    for ch in kana:
        if vg[ch][0]:
            chunks['base'][ch] = vg[ch][0]

    vgloss, vocab, seen = tsv('vocab_id.tsv'), [], set()
    for lv in ('n5', 'n4', 'n3', 'n2', 'n1'):
        text = fetch(f'https://raw.githubusercontent.com/jamsinclair/open-anki-jlpt-decks/main/src/{lv}.csv', f'{lv}.csv')
        for row in csv.DictReader(io.StringIO(text)):
            word = row['expression'].strip()
            if word in seen:
                continue
            seen.add(word)
            en = row['meaning'].strip()
            entry = {'word': word, 'reading': row['reading'].strip(), 'meaning': vgloss.get(word, en), 'level': lv.upper()}
            if word in vgloss:
                entry['en'] = en
            vocab.append(entry)

    def dump(path, obj):
        with open(os.path.join(OUT, path), 'w', encoding='utf-8') as f:
            json.dump(obj, f, ensure_ascii=False, separators=(',', ':'))
    dump('kanji.json', kanji)
    dump('vocab.json', vocab)
    for name, obj in chunks.items():
        dump(f'strokes/{name}.json', obj)
    if os.path.exists(os.path.join(OUT, 'strokes.json')):
        os.remove(os.path.join(OUT, 'strokes.json'))
    print(len(kanji), 'kanji,', len(vocab), 'words,', {k: len(v) for k, v in chunks.items()}, 'stroke sets;',
          sum(1 for k in kanji if k['char'] in gloss), 'kanji glossed,', sum(1 for w in vocab if 'en' in w), 'words translated')

main()
