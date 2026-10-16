"""
Genera src/data/mapShapes.ts (mapa de cobertura) a partir de los límites provinciales oficiales del IGN.

Uso:
  curl -L -o /tmp/prov.json "https://wms.ign.gob.ar/geoserver/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=ign:provincia&outputFormat=application/json&srsName=EPSG:4326"
  python3 -I scripts/build-map.py /tmp/prov.json src/data/mapShapes.ts
"""
import json, sys, math
src, out = sys.argv[1], sys.argv[2]
d = json.load(open(src))
NEIGHBORS = ['Catamarca', 'Santiago del Estero', 'Santa Fe', 'Buenos Aires', 'La Pampa', 'San Luis', 'La Rioja']
MAIN = 'Córdoba'
CONTEXT = ['Tucumán', 'Salta', 'Chaco', 'Entre Ríos', 'Mendoza', 'San Juan', 'Río Negro', 'Neuquén', 'Corrientes', 'Ciudad Autónoma de Buenos Aires']
LAT0 = -32.0
K = math.cos(math.radians(LAT0))

def proj(lon, lat):
    return (lon * K, -lat)

def area(r):
    a = 0
    for i in range(len(r) - 1):
        a += r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1]
    return a / 2

def dp(pts, eps):
    if len(pts) < 3:
        return pts
    stack = [(0, len(pts) - 1)]
    keep = [False] * len(pts); keep[0] = keep[-1] = True
    while stack:
        s, e = stack.pop()
        ax, ay = pts[s]; bx, by = pts[e]
        dx, dy = bx - ax, by - ay
        L = math.hypot(dx, dy) or 1e-12
        best, idx = 0, None
        for i in range(s + 1, e):
            px, py = pts[i]
            dist = abs(dy * px - dx * py + bx * ay - by * ax) / L
            if dist > best:
                best, idx = dist, i
        if idx is not None and best > eps:
            keep[idx] = True
            stack += [(s, idx), (idx, e)]
    return [p for p, k in zip(pts, keep) if k]

feats = {f['properties']['nam']: f for f in d['features']}
wanted = [MAIN] + NEIGHBORS + CONTEXT
shapes = {}
for name in wanted:
    g = feats[name]['geometry']
    polys = []
    for poly in g['coordinates']:
        ring = [proj(lon, lat) for lon, lat in poly[0]]
        a = abs(area(ring))
        if a < 0.02 and name != 'Ciudad Autónoma de Buenos Aires':
            continue
        polys.append((a, ring))
    shapes[name] = polys

# Encuadre: las 8 provincias de cobertura
xs, ys = [], []
for name in [MAIN] + NEIGHBORS:
    for _, ring in shapes[name]:
        for x, y in ring:
            xs.append(x); ys.append(y)
minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
pad = 0.4
minx -= pad; maxx += pad; miny -= pad; maxy += pad
W = 1000
S = W / (maxx - minx)
H = round((maxy - miny) * S)

def tx(x, y):
    return ((x - minx) * S, (y - miny) * S)

def path(polys, eps):
    parts = []
    for _, ring in polys:
        pts = [tx(x, y) for x, y in ring]
        mid = len(pts) // 2
        pts = dp(pts[:mid + 1], eps)[:-1] + dp(pts[mid:], eps)
        if len(pts) < 4:
            continue
        parts.append('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in pts[:-1]) + 'Z')
    return ''.join(parts)

def centroid(polys):
    a, ring = max(polys, key=lambda t: t[0])
    pts = [tx(x, y) for x, y in ring]
    A = cx = cy = 0
    for i in range(len(pts) - 1):
        x0, y0 = pts[i]; x1, y1 = pts[i + 1]
        c = x0 * y1 - x1 * y0
        A += c; cx += (x0 + x1) * c; cy += (y0 + y1) * c
    A /= 2
    return (cx / (6 * A), cy / (6 * A))

def point(lat, lon):
    return tx(*proj(lon, lat))

entries = []
for name in [MAIN] + NEIGHBORS + CONTEXT:
    kind = 'main' if name == MAIN else ('neighbor' if name in NEIGHBORS else 'context')
    dpath = path(shapes[name], 1.2)
    lx, ly = centroid(shapes[name])
    entries.append({'name': name, 'kind': kind, 'd': dpath, 'labelX': round(lx), 'labelY': round(ly)})

pins = {
    'capital': point(-31.4167, -64.1833),
    'jesus-maria': point(-30.9833, -64.0942),
}
ts = ['/** Mapa de cobertura generado con scripts/build-map.py (límites provinciales del IGN, simplificados). No editar a mano. */',
      f'export const MAP_WIDTH = {W};', f'export const MAP_HEIGHT = {H};',
      'export type MapKind = "main" | "neighbor" | "context";',
      'export const PROVINCES: { name: string; kind: MapKind; d: string; labelX: number; labelY: number }[] = ' + json.dumps(entries, ensure_ascii=False) + ';',
      'export const MAP_PINS: Record<string, { x: number; y: number }> = ' + json.dumps({k: {'x': round(v[0], 1), 'y': round(v[1], 1)} for k, v in pins.items()}) + ';', '']
open(out, 'w').write('\n'.join(ts))
print('size', W, H, 'bytes', len('\n'.join(ts)))
for e in entries: print(e['name'], e['kind'], len(e['d']), e['labelX'], e['labelY'])
print(pins)
