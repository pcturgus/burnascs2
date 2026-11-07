# Burnas CS2 portfolio (Vercel)

Failai:
- index.html       - puslapis (viskas viename faile)
- api/leetify.js   - Leetify duomenys (reitingai, statistika, paskutiniai mačai); išsaugoma 6 valandoms
- api/twitch.js    - ar kanalas dabar transliuoja (LIVE / OFFLINE, žaidimas, žiūrovai); tikrinama kas ~minutę

## Kaip paleisti (apie 5 min.)
1. GitHub: sukurk repozitoriją ir įkelk šiuos failus ta pačia struktūra (api aplankas turi likti aplankas).
2. vercel.com -> Add New -> Project -> pasirink repozitoriją -> Deploy.
3. Patikrink:  <tavo-adresas>/api/leetify  ir  <tavo-adresas>/api/twitch  - turi rodyti JSON.

## Twitch LIVE statusas (rekomenduojama su raktais)
Be raktų veikia per laisvą decapi.me pagalbininką (trečioji šalis). Patikimiau - per oficialų Twitch API:
1. https://dev.twitch.tv/console -> Register Your Application
   (Name: bet koks, OAuth Redirect URL: http://localhost, Category: Website Integration, Client Type: Confidential)
2. Atsidariusioje programoje nukopijuok Client ID ir spausk "New Secret".
3. Vercel -> Project -> Settings -> Environment Variables:  TWITCH_CLIENT_ID  ir  TWITCH_CLIENT_SECRET
4. Vercel -> Deployments -> Redeploy.

## Kiti nustatymai (nebūtina)
- STEAM64_ID     - kito žaidėjo Leetify (numatyta: 76561197970987115)
- PREMIER_PEAK   - tavo aukščiausias Premier reitingas (numatyta: 26958)
- TWITCH_CHANNEL - kanalo vardas (numatyta: burnascs2)

## Jei Leetify skaičiai neatsinaujina
1. Atsidaryk  <tavo-adresas>/api/leetify . Jei rodo klaidą ("error"), puslapis rodo išsaugotą kopiją (apačioje atsiranda ⚠ žymė).
2. Dažniausia priežastis - Leetify užklausų limitas. Gauk nemokamą raktą: https://leetify.com/app/developer
   ir įrašyk Vercel -> Settings -> Environment Variables:  LEETIFY_API_KEY  (tada Redeploy).
