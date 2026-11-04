# Wedding invitation

## Preview

```
npm install
npm run dev
```

Then open http://localhost:5173. Restart it after changing colours.

## Change the details and colours

Everything is in `wedding.config.mjs`: names, parents, date, time zone, events, venue, wording, image paths, music and the two theme colours (`primary` and `accent`).

## Change the images and music

Put your files in `public/` and update the paths under `images` and `music` in `wedding.config.mjs`.

| Setting | Where it appears | Shape |
| --- | --- | --- |
| `images.toran` | Small garland on the opening screen | Wide, transparent background, repeats across the screen |
| `images.ganesh` | Opening animation and small marks | Portrait, white on transparent |
| `images.couple` | Couple standing above the footer | Portrait, transparent background |
| `images.emblem` | Beside the names on the opening screen | Portrait, transparent background |
| `images.hero` | Large centre illustration | 3:2 |
| `images.corner` | Top corner garlands (mirrored) | 2:3 |
| `images.border` | Side borders (repeats vertically) | 1:3 |

The cut-out hands, feet and leaves from the earlier design are kept in `art-unused/`. They aren't part of the site.

## Publish

The site is at https://theakstudio.in/wedding/

To publish your latest changes, run:

```
npm run deploy
```

This builds the site, copies it into `public/wedding` in the AK-studio repo (expected at `../AK/AK-studio`), and pushes that repo's `master` branch, which deploys theakstudio.in. It stops without publishing if AK-studio has uncommitted changes or isn't on `master`. Save your source too with `git add -A`, `git commit` and `git push`.
