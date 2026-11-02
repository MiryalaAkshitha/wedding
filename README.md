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

## Connect RSVP to Google Sheets

Until this is done, the RSVP page says setup is pending and saves nothing.

1. Create a private Google Sheet and open Extensions > Apps Script.
2. Paste in `setup/google-apps-script.gs` and replace `REPLACE_WITH_YOUR_SPREADSHEET_ID` with the ID from the Sheet's URL.
3. Choose Deploy > New deployment > Web app. Set Execute as: Me, and Who has access: Anyone.
4. Copy the URL ending in `/exec` into `public/config.js`.
5. Send a test RSVP and confirm that one row appears in the Sheet.

## Publish on GitHub Pages

The site is at https://miryalaakshitha.github.io/wedding/

To publish your latest changes, run:

```
npm run deploy
```

This builds the site and updates the `gh-pages` branch. Save your source too with `git add -A`, `git commit` and `git push`.
