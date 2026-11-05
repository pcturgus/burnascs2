# Burnas CS2 portfolio (Vercel)

Failai:
- index.html      - puslapis (viskas viename faile)
- api/leetify.js  - serverio funkcija, kuri paima Leetify duomenis ir juos 2 dienoms išsaugo

## Kaip paleisti (apie 5 min.)
1. GitHub: sukurk naują repozitoriją (pvz. burnas-cs2) ir įkelk šiuos failus tokia pačia struktūra
   (api aplankas turi likti aplankas!).
2. vercel.com -> Add New -> Project -> pasirink repozitoriją -> Deploy
   (Framework Preset: Other, nieko daugiau keisti nereikia).
3. Atsidaryk gautą adresą. Patikrink ir  <tavo-adresas>/api/leetify  - turėtum matyti JSON su Leetify duomenimis.

## Nustatymai (nebūtina)
Vercel -> Project -> Settings -> Environment Variables:
- STEAM64_ID   - jei norėtum kito žaidėjo (numatyta: 76561197970987115)
- PREMIER_PEAK - tavo aukščiausias Premier reitingas (numatyta: 26958)

## Kaip dažnai atsinaujina
Funkcija atsakymą išsaugo 2 dienoms (172800 s). Praėjus šiam laikui, pirmas atėjęs lankytojas
gauna dar senus duomenis, o fone paimami nauji; kitas jau mato naujus.
Jei API neatsako, puslapis rodo paskutinius žinomus skaičius, todėl nelūžta.
