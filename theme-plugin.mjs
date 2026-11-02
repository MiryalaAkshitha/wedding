// Recolours the stylesheets at build time, so one primary and one accent colour restyle the whole site.
// The CSS keeps its original wine and gold shades; each is shifted relative to these two reference colours.
const SOURCE = { primary: '#681b2c', accent: '#dfb879' };

function toHsl(hex) {
  const [r, g, b] = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, l = (max + min) / 2;
  if (!d) return [0, 0, l];
  const h = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, d / (1 - Math.abs(2 * l - 1)), l];
}
function toHex([h, s, l]) {
  const f = n => {
    const k = (n + h / 30) % 12;
    return Math.round((l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255).toString(16).padStart(2, '0');
  };
  return f(0) + f(8) + f(4);
}
const clamp = v => Math.min(1, Math.max(0, v));
const expand = hex => (hex.length < 6 ? [...hex].map(c => c + c).join('') : hex).toLowerCase();

export function recolor(css, theme) {
  const pair = key => [toHsl(expand(SOURCE[key].slice(1))), toHsl(expand(theme[key].slice(1)))];
  const primary = pair('primary'), accent = pair('accent');
  const shift = ([h, s, l], [from, to]) => [(h + to[0] - from[0] + 360) % 360, clamp(s * (to[1] / from[1])), clamp(l + to[2] - from[2])];
  return css.replace(/#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/gi, match => {
    const full = expand(match.slice(1)), alpha = full.slice(6), hsl = toHsl(full.slice(0, 6));
    if (hsl[1] < 0.12) return match;
    if (hsl[0] >= 330 || hsl[0] < 20) return '#' + toHex(shift(hsl, primary)) + alpha;
    if (hsl[0] < 70) return '#' + toHex(shift(hsl, accent)) + alpha;
    return match;
  });
}

export default function themePlugin(theme, wedding) {
  const title = `${wedding.groom.name} weds ${wedding.bride.name}`;
  return {
    name: 'wedding-theme',
    enforce: 'pre',
    transform(code, id) {
      return id.split('?')[0].endsWith('.css') ? { code: recolor(code, theme), map: null } : null;
    },
    transformIndexHtml(html) {
      return recolor(html, theme).replaceAll('%TITLE%', title);
    },
  };
}
