# Animation documentation — શરૂઆત અહીંથી કરો

**Project:** HIGH TOSS pizza shop  
**Documentation date:** 13 November 2026  
**Scope:** ZIPમાં આપવામાં આવેલા implementationનું વર્ણન, asset preparation, અને આવી animationવાળી website બનાવવાની practical રીત.

આ documents બે પ્રશ્નનો જવાબ આપે છે: **આ projectમાં ખરેખર શું બનાવ્યું છે?** અને **બીજા projectમાં આવું કામ યોગ્ય રીતે કેવી રીતે કરાવવું?**

ગુજરાતી સમજણ સાથે code identifiers અને technical details Englishમાં રાખ્યા છે, જેથી તમે પોતે વાંચી શકો અને Antigravity / Cursor / બીજા developerને પણ આપી શકો.

## કઈ file પહેલાં વાંચવી?

| File | શું સમજાવે છે |
| --- | --- |
| [01_PIZZA_ANIMATION_IMPLEMENTATION.md](01_PIZZA_ANIMATION_IMPLEMENTATION.md) | હાલના codeનો સંપૂર્ણ flow, librariesની જવાબદારી, timeline values, state, positioning, controls, અને દરેક componentમાં કરેલું કામ. |
| [02_REFERENCE_VIDEO_AND_ASSETS.md](02_REFERENCE_VIDEO_AND_ASSETS.md) | Reference video કેવી રીતે તપાસ્યો, frames કેવી રીતે તૈયાર થયા, recorded UI કેવી રીતે અલગ કર્યું, final assets અને તેમને બદલવાની રીત. |
| [03_ANIMATED_WEBSITE_WORKFLOW.md](03_ANIMATED_WEBSITE_WORKFLOW.md) | આવી website માટે શરૂઆતથી planning, technology selection, scene breakdown, responsive layout અને implementation workflow. |
| [04_TESTING_PERFORMANCE_AND_DEBUGGING.md](04_TESTING_PERFORMANCE_AND_DEBUGGING.md) | Testing checklist, current verification, performance budgets, memory, common errors અને debugging steps. |
| [05_AI_DEVELOPER_HANDOFF_PROMPT.md](05_AI_DEVELOPER_HANDOFF_PROMPT.md) | Antigravity / Cursorમાં આપવા માટે copy-paste English prompt અને reusable animation brief. |
| [06_ASSET_PROMPTS_AND_REFERENCES.md](06_ASSET_PROMPTS_AND_REFERENCES.md) | Final image asset briefs, reproducibility notes અને official technical references. |

## સૌથી મહત્વની સમજણ

આ website **hybrid animation** વાપરે છે:

- Chef અને doughની movement reference videoમાંથી બનાવેલી **pre-rendered image sequence** છે.
- Browserમાં scroll પ્રમાણે Canvas પર યોગ્ય frame દેખાડવામાં આવે છે.
- Text, navbar, buttons અને customizer ખરેખર HTML / React UI છે.
- Toppings CSS elements છે; price અને selection React stateમાંથી આવે છે.
- Baking એક timed animation છે: raw અને cooked pizza images વચ્ચે crossfade, spin અને temperature counter.
- Scooter, receipt અને review cardsના interactions codeથી ચાલે છે.

Chef માટે editable 3D model, skeleton, camera કે physics engine આ ZIPમાં નથી. ફક્ત package ઉમેરવાથી reference જેવી chef movement આપમેળે બનતી નથી; યોગ્ય assets અને scene planning બંને જરૂરી છે.

## Current implementation અને future advice વચ્ચેનો ફરક

- **Implemented / Current:** ZIPમાં હાલ ખરેખર હાજર behavior.
- **Recommendation / Future:** આવતા project અથવા આગળના improvement માટેની સલાહ; તેને હાલની feature માનવી નહીં.
- **Verified:** અગાઉની build/browser checksમાં જોવાયેલું.
- **To test:** release પહેલાં તપાસવાની બાકી બાબતો.

આ documentation updateમાં ZIPના existing application filesના bytes જાળવીને ફક્ત `docs/` ઉમેરાયું છે. Rootના `README.md` અને `CHANGED_FILES.md` પણ વાંચવા જેવા છે.

## Local setup

Project root એટલે `package.json` જે folderમાં છે તે folder.

```bash
npm ci
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

`.nvmrc` Node 24 બતાવે છે; અગાઉની build Node 24.22.1 સાથે ચકાસેલી છે. Bundled Viteનું engine constraint `^20.19.0 || >=22.12.0` છે. નવી systemમાં Node 24 અને supplied `package-lock.json` સાથે શરૂઆત કરવી સરળ રહેશે.

નવી libraries install કરવી, image-generation API call કરવી કે video upload કરવો page ચલાવવા માટે જરૂરી નથી. Final runtime assets ZIPમાં જ છે.
