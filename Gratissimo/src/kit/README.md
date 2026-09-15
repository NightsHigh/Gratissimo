# Vue component kit

`kit/` is components you import and should not edit —
restyle them through the tokens instead. 
`templates/` editing them is the point.
`templates/api.js` is one of those: it lands as `src/api.js`, and every page
template imports its calls from there rather than calling `fetch` itself.

1. Copy `kit/` folder into your app's `src/`.
2. Import the tokens, in your entry file:
   ```js
   import '@/kit/tokens.scss'
   ```
3. Import components by name:
   ```js
   import { Card, Button } from '@/kit'
   ```

Your app needs Vue 3, `vue-router` and `sass` — nothing else. Edit a `.vue`
file and the dev server reloads it; the kit has no rebuild step.

Every colour, space and size lives in `tokens.scss`. Restyle the kit by
overriding those custom properties in your own stylesheet.
