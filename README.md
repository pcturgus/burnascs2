# Burnas CS2 portfolio (Vercel)

Failai:
- index.html            - puslapis
- api/leetify.js        - Leetify statistika + mačai (atnaujinama ~kas 6 val.)
- api/twitch.js         - LIVE / OFFLINE statusas (tikrinama kas ~30 s)
- api/twitch-clips.js   - tavo Twitch klipai (atnaujinami ~kas 10 min.)

## Twitch raktai (reikalingi LIVE statusui ir klipams)
1. https://dev.twitch.tv/console -> Register Your Application
   (Name: bet koks, OAuth Redirect URL: http://localhost, Category: Website Integration, Client Type: Confidential)
2. Atsidariusioje programoje nukopijuok Client ID ir spausk "New Secret" (nukopijuok ir Secret).
3. Vercel -> Project -> Settings -> Environment Variables (Type: Secret, Environment: Production):
   TWITCH_CLIENT_ID  ir  TWITCH_CLIENT_SECRET
4. Vercel -> Deployments -> Redeploy.
5. Patikrink:  <adresas>/api/twitch  ir  <adresas>/api/twitch-clips

## Kiti nustatymai (nebūtina)
- LEETIFY_API_KEY - Leetify raktas (limitams)
- STEAM64_ID, PREMIER_PEAK, TWITCH_CHANNEL
