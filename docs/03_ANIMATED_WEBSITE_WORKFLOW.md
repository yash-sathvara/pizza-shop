# આવી animationવાળી website કેવી રીતે બનાવવી / બનાવડાવવી

આ guide reuse કરી શકાય છે: pizza, clothing, bottle, product story અથવા બીજી animated landing page માટે. નીચેની technology choices implementation judgment છે; દરેક reference માટે same package અથવા same effect લાગુ પડતો નથી.

## 1. શરૂઆતમાં outcome સ્પષ્ટ કરો

“આ video જેવું બનાવી દો” સાથે નીચેની માહિતી હોય તો developer / AIને ઓછું guess કરવું પડે:

| Brief item | લખવાનું ઉદાહરણ |
| --- | --- |
| Reference | Video filename / URL અને કયો ભાગ important છે. |
| Required sequence | Object enters → rotates → user selects → result → next section. |
| Input | Scroll, click, drag, hover, automatic playback કે combination. |
| Visual invariants | Same brand colors, typeface, object proportions, line thickness, framing. |
| Reversible behavior | Scroll back કરે તો શું પાછું થવું જોઈએ? Selection reset થશે કે રહેશે? |
| Screen targets | Mobile, tablet, laptop, wide desktop; portrait/landscape. |
| Existing constraints | Framework, current folder structure, installed packages, deploy target. |
| Real functionality | Price calculation, product state, API calls, caching, real cart કે demo. |
| Deliverables | Full source ZIP, changed-file list, setup docs, tested live preview. |
| Acceptance | કયા visible behaviors વગર કામ complete ગણાશે નહીં. |

તમારા current pizza exampleમાં chef movement asset-based છે, toppings state-based છે અને baking timed છે. આ ત્રણને એક જ “animation” તરીકે loosely define કરવાથી flow બગડી શકે છે.

## 2. Reference analysis પહેલા કરો

1. Video એક વાર normal speedમાં જુઓ: overall story સમજવા.
2. Key momentsના stills કાઢો: beginning, action peak, handover, completion.
3. Moving layersની list બનાવો: background, subject, product, text, cards, UI.
4. Camera/object બંને move કરે છે કે ફક્ત image zoom થાય છે તે અલગ કરો.
5. Depth, occlusion અને lighting observe કરો: object textની આગળ છે કે પાછળ?
6. Key poses માપો: normalized center, scale, angle, anchor, crop.
7. Transitionsમાં શું જળવાય છે તે લખો: same pizza, same bottle, same logo line width.
8. Interactionને video playbackથી જુદું કરો. Recorded clickનો અર્થ runtime button હોવો જોઈએ.
9. Missing evidence સ્પષ્ટ લખો. Screen recording જોઈને original engine ચોક્કસ ઓળખી શકાય એવું જરૂરી નથી.

આમાંથી scene-spec table બનાવો:

| Scene | Entry | Exit | Driver | Asset | UI | Reverse rule |
| --- | --- | --- | --- | --- | --- | --- |
| Preparation | Chef waiting | Dough stretched | Scroll | Frame sequence | Small caption | Reverse frames |
| Customization | Pizza ready | Toppings selected | Click | Neutral pizza + pieces | Buttons/price | Preserve selection |
| Bake | Raw pizza | Cooked pizza | Time after action | Raw/cooked textures | Disabled controls/counter | Explicit reset |

આ tableમાં “simple fade” લખવાને બદલે start/end values અથવા expected visible state આપો.

## 3. Technology effect પ્રમાણે પસંદ કરો

| Need | Practical approach | Tradeoff / ધ્યાનમાં રાખવાનું |
| --- | --- | --- |
| Simple content reveal, slide, rotate | CSS / DOM transforms; timeline tool if needed | Real text/buttons રાખવા સરળ; complex realistic subject movement માટે assets જોઈએ. |
| Continuous background film | HTML video | Good for linear playback; precise arbitrary scroll seeking માટે encoding/testing જોઈએ. |
| Predictable scroll-scrubbed cinematic render | Pre-rendered image sequence + Canvas | Strong pose control; download/decode/cache memory budget જોઈએ. |
| Logo paths, line morphs, diagram-like geometry | Existing SVG paths + code animation | Editable, sharp vectors; path structure and continuity મહત્વની. |
| Dense custom 2D drawing | Canvas 2D | Drawing control મળે; accessibility માટે parallel DOM UI જોઈએ. |
| Real camera orbit, lighting/material changes, changing viewpoint | Actual WebGL / 3D scene, e.g. Three.js ecosystem | Proper models, textures, lighting, performance અને fallbackનું કામ વધે. |
| Compact designer-authored 2D animation | Compatible vector/state animation asset/runtime | Export fidelity, interaction needs અને asset pipeline verify કરવા. |

આ optionsમાંથી વધુ packages ઉમેરવા જ યોગ્ય નિર્ણય નથી. Existing stackથી requirement પૂર્ણ થાય તો તેને જ રાખવું. New dependency જોઈએ તો feature need, maintenance અને compatibility ચકાસીને ઉમેરવી.

**2.5D અને real 3D:** flat PNGને rotate/scale કરીને depthનો look આપી શકાય છે. પણ backside, camera orbit, physical lighting અથવા complex mesh deformation જોઈતી હોય તો માત્ર image transformથી same result મળતું નથી.

## 4. Asset planning implementation પહેલાં

Animationનું quality code જેટલું જ assets પર આધારિત છે.

- Product આગળ-પાછળથી દેખાવાનો હોય તો યોગ્ય viewpoints જોઈએ.
- Hovering object માટે background અલગ હોય તો handover અને positioning સરળ બને છે.
- Customizerમાં selectable વસ્તુ base textureમાં પહેલેથી મૂકવી નહીં.
- Backgroundમાં nav/text bake કરેલું હોય તો future translations અને responsiveness મુશ્કેલ બને છે.
- One continuous object માટે scale, center અને lighting consistent રાખવા.
- Sprite / frame sequenceના filenames, count અને dimensions fixed રાખવા.
- Sharp source હોવું જોઈએ; upscalingથી missing physical detail પાછી આવતી નથી.

Missing asset માટે accidental screenshot cropને final production texture ન બનાવવું. જરૂર હોય તો deliberate asset generation / design / 3D render કરાવવું અને result inspect કરવું.

## 5. Implementationનો યોગ્ય order

### Step 1 — Existing project audit

Entry point, routing, package manager, lockfile, styles, components, assets અને build commands વાંચો. Broken start/build પહેલાં fix કરો. Business functionality અને current state ownership ઓળખો.

Deliverable: current structure, problem list, asset inventory, chosen animation method.

### Step 2 — Layout અને scene layers

Typography, main sections, background, product slot અને controls માટે static composition બનાવો. Initial અને final states બંને desktop/mobile પર readable હોવા જોઈએ.

Deliverable: recognizable first version; correct hierarchy and framing.

### Step 3 — એક vertical slice

ફક્ત first important sequence પૂર્ણ કરો: entry → main action → final pose. Placeholder buttonથી final state સુધી જઈ શકાય એવું કરો.

Deliverable: એક end-to-end working scene. તમામ pagesમાં અર્ધા effects એકસાથે શરૂ કરવા કરતાં આથી early problems ઝડપથી દેખાય છે.

### Step 4 — Geometry એક જગ્યાએ નક્કી કરો

Same sceneના elements માટે shared coordinate system રાખો. Position, scale, camera/crop અને overlay mapping એક function અથવા measured layoutમાંથી આવવા જોઈએ.

Deliverable: one reliable resize/reframe path. Fixed pixel guessesને અલગ componentsમાં duplicate ન કરો.

### Step 5 — Timeline અને state અલગ કરો

Scroll-driven: image frame, text reveal, camera/product move.  
Time-driven: bake, success, loading transition.  
User-driven: selection, drag, theme, next card.  
Data-driven: API response, price, stock, cached result.

એક timeline દરેક પ્રકારનું state own કરે એવું જરૂરી નથી. User price selectionને scroll positionથી overwrite થવા ન દો.

### Step 6 — Lifecycle અને input handling

એક action એક જ tween/loop શરૂ કરે. Double click, wheel interruption, route unmount અને reset માટે behavior લખો. Listener/ticker/observer cleanup રાખો. React StrictModeમાં duplicate side effects દેખાય તો actual cleanup સુધારો.

### Step 7 — Responsive composition

Small screen પર storyનું meaning જાળવીને geometry બદલો. Font ઘટાડવું એકલું responsive solution નથી. Product focus, text safe zone, builder space, sticky height અને touch target પણ બદલાય શકે છે.

### Step 8 — Following sections

Hero પછીની receipt/result/menu actual shared state વાંચે. Same objectનો illusion જોઈએ તો determine કરો કે shared DOM element move કરશો, matched duplicate render વાપરશો કે view transition કરશો. Duplicate rendererને actual seamless object morph તરીકે describe ન કરો.

### Step 9 — Compare, profile, correct

Same story phase અને same viewport પર reference અને implementation compare કરો. One observed mismatch at a time fix કરો. Build errors પહેલાં, પછી behavior, પછી visual polish.

### Step 10 — Package and document

Run production build, verify asset paths, include lockfile/setup/changed-file list. Temporary QA files, `node_modules`, credentials અને environment-only setup deliverableમાંથી બહાર રાખો. Publish only the intended audience અને return actual verified URL.

## 6. Motion specification કેવી રીતે લખવી

| Property | Weak requirement | Useful requirement |
| --- | --- | --- |
| Entry | “Pizza nice રીતે આવે.” | “At phase 0.60 opacity 0; by 0.64 opacity 1; center remains aligned with filmed pizza.” |
| Rotation | “Rotate it.” | “Rotate the texture inside the perspective wrapper; keep wrapper anchor fixed.” |
| Scroll | “Smooth scroll.” | “One scroll owner; reversible progress; no duplicate loops; user input cancels guided play.” |
| Topping | “Add animation.” | “Mount selected ingredient pieces at data positions, stagger their entry, update price once.” |
| Result | “Show receipt.” | “Display the same chosen options and calculated total.” |
| Mobile | “Make responsive.” | “Keep product visible above the builder; no input hidden under fixed nav; verify short height.” |
| Fidelity | “Exactly 100%.” | “Compare key poses; list known differences such as generated plate or missing 3D model.” |

Duration અને easing narrative પ્રમાણે પસંદ કરવી. Slow preparation, quick ingredient drop અને strong final revealને એક જ default ease આપી દેતાં બધું same feel થાય છે. Values hardcode કરતાં તેઓ tune ક્યાંથી થાય છે તે document કરો.

## 7. Continuous-object transition માટે શું ખાસ ધ્યાન રાખવું?

Bottle એક sectionથી બીજીમાં જાય, building lines logo બને અથવા pizza receiptમાં જાય ત્યારે:

1. Start/end bounding boxes અને anchor record કરો.
2. Width/height બદલાય ત્યારે perceived thickness અને aspect ratio check કરો.
3. Parent transforms childને double-scale તો નથી કરતાં તે તપાસો.
4. Layer order transition દરમ્યાન પણ consistent રાખો.
5. Transparent imageમાં unwanted margins objectને ખસેડતા તો નથી?
6. Color, light direction અને shadowનો jump ઓળખો.
7. Source અને destination shapes compatible છે કે વચ્ચે new asset જોઈએ તે નક્કી કરો.
8. Forward તથા backward transition બંને જુઓ.
9. Layout reflow થયા પછી measurements refresh કરો.
10. Exact continuity જરૂરી હોય તો duplicate imagesની simple fade પૂરતી છે કે નહીં તે visual comparisonથી નક્કી કરો.

Current pizza project shared state/renderersથી consistency આપે છે; single physical pizza DOM nodeનો section-to-section morph આગળનો અલગ feature રહેશે.

## 8. Responsive animation માટે practical rules

- Scene “safe zones” બનાવો: product, text અને controls માટે અલગ usable area.
- Wide backgroundને `cover` આપતાં શું crop થશે તે model કરો.
- Mobileમાં horizontal focus interpolate કરવો પડે તો shared mappingમાંથી કરો.
- Sticky stageને too-short viewportમાં force ન કરો; static/short story fallback વિચારવો.
- `svh`થી stable viewport layout રાખી શકાય છે; address bar અને orientation real device પર ચકાસવા.
- Hover-only interactions માટે touch/click equivalent આપો.
- Body અને nested scrolling containers અનાયાસ બનાવશો નહીં.
- 900px જેવા breakpointની બંને બાજુ test કરો; CSS `<=` અને JavaScript `<` conditions match થાય છે કે નહીં જુઓ.
- Browser zoom અને larger textથી card height બદલાય ત્યારે controls reachable રહેવા જોઈએ.
- Load વગર black screen ન રાખો: poster, readable copy અને usable navigation રાખો.

## 9. AI સાથે વધુ accurate કામ કેવી રીતે કરાવવું?

AIને ફક્ત videoનું description આપી દેવા કરતાં source અને expected behavior સાથે **evidence loop** આપો:

1. Project અને reference inspect કરાવો.
2. Findings તથા layer/scene map લખાવાવો.
3. Which parts require assets versus code તે સ્પષ્ટ કરાવો.
4. Existing structureમાં one working scene implement કરાવો.
5. Browserમાં ચલાવી actual screenshot/interaction compare કરાવો.
6. Errorનું કારણ અને changed files report કરાવો.
7. Same mismatch repeatedly હોય તો random CSS tweaks અટકાવી coordinate/state ownership તપાસાવવો.
8. Final claimsને evidence સાથે બાંધો: build pass ≠ animation visually correct.

“Advanced / premium / cinematic / 3D” જેવા adjectives useful measurements, inputs, assets અને state transitionsનું substitute નથી.

Ready-to-copy prompt અને reusable brief [05_AI_DEVELOPER_HANDOFF_PROMPT.md](05_AI_DEVELOPER_HANDOFF_PROMPT.md)માં છે.
