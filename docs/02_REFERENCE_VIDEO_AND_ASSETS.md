# Reference video analysis અને asset preparation

## 1. Input શું હતું?

| Input | Actual observation |
| --- | --- |
| `public/pizza_shop_screen_recording.mp4` | 1280 × 720, 30 fps, approximately 18.067 seconds. |
| Earlier `public/frames` | 129 WebP frames of the recorded page; recorded text/navigation included. |
| Earlier image assets | Delivery/review images usable; old raw-pizza PNG contained a circular scene crop. |
| Existing application | React components and GSAP/Lenis setup already present. |

Reference એક **screen recording** છે, clean animation render નથી. તેમાં website UI, changing captions, perspective/capture artifacts અને playback controls પણ સામેલ હતાં. તેથી તેને સીધું website background તરીકે મૂકી ઉપર નવું UI બનાવવું પૂરતું નહોતું.

## 2. Referenceને scenesમાં વહેંચ્યો

આ semantic breakdown છે; whole videoના exact timestamp claims નથી.

| Scene | શું observe કરવું | Browser implementation માટે નિર્ણય |
| --- | --- | --- |
| Opening | Kitchen, small chef, large brand headline, nav | Kitchen image/frames પાછળ; own headline/nav આગળ. |
| Preparation | Chef approaches and stretches dough | Pre-rendered sequence from source. |
| High toss | Dough lifts, changes pose, prepares cheese base | Scroll-linked frames. |
| Customization | Pizza hovers; user changes toppings | Clean final scene plus separate interactive pizza texture. |
| Baking | Temperature rises, pizza browns/spins | Timed tween + two texture crossfade; independent topping layer. |
| Receipt | Baked pizza and itemized summary | Shared React state and renderer. |
| Delivery | Scooter crosses night scene | Existing asset with scroll position mapping. |
| Reviews/menu/footer | Card fan, price board, large final CTA | Actual DOM UI and targeted animation. |

દરેક scene માટે entry pose, exit pose, object center, crop, text position, overlap અને input type નોંધવું જરૂરી છે. Scroll captureમાં passage ઝડપથી થાય છે એટલે source videoના secondsને સીધા website scroll percentagesમાં copy કર્યાં નથી.

## 3. Applied chef sequence

Selected source interval: approximately **1.15 secondsથી શરૂ થતો 4-second segment**. તેને 24 samples per secondમાં extract કર્યો એટલે 96 frames મળ્યા. Final indices `000…095` છે; last nominal sample `1.15 + 95/24 ≈ 5.108` seconds પર છે. Encoder seeking/sampling detailsથી exact sampled momentમાં નાનો ફરક આવી શકે.

Bash example, project rootમાંથી:

```bash
mkdir -p tools/tmp/chef-source public/chef
ffmpeg -hide_banner -loglevel error \
  -ss 1.15 -t 4 \
  -i public/pizza_shop_screen_recording.mp4 \
  -vf fps=24 \
  tools/tmp/chef-source/%03d.png
```

`ffmpeg` frame extraction વખતે જ જોઈએ છે; website runtime dependency નથી. Source metadata તપાસવા:

```bash
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate \
  -show_entries format=duration -of json \
  public/pizza_shop_screen_recording.mp4
```

Windowsમાં FFmpeg ઉપલબ્ધ હોવું જોઈએ. ઉપર command Bash syntaxમાં છે; PowerShellમાં one-line equivalent ચલાવી શકાય.

## 4. Recorded UI cleanup કેવી રીતે થયું?

નવી sequenceની first frame clean plate તરીકે લીધી: એવી source frame જેમાં unwanted headings ઓછાં હતાં. Static kitchen areaનો ઉપયોગ કરીને captionsના regionsને feathered masksથી cover કર્યા. Recorded top navigation અને bottom control regions માટે blurred/darkened image bands બનાવ્યા.

Applied recipeના important values:

| Operation | Value |
| --- | --- |
| Early-caption mask | Rectangle `(0,110) → (470,265)`, only indices `<80` |
| Lower-left caption mask | Rectangle `(0,525) → (490,720)` |
| Mask feather | Gaussian blur radius 16 |
| Top strip source | `(0,105) → (1280,200)`, resized to 1280 × 105 |
| Top strip treatment | Blur 18; brightness factor 0.55 |
| Bottom strip source | `(0,625) → (1280,675)`, resized to 1280 × 45 |
| Bottom strip treatment | Blur 12; brightness factor 0.6 |
| Final dimensions | 1280 × 720, preserved |
| WebP export | quality 84, method 6 |

Equivalent preparation code, after extracting the PNGs:

```python
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

sources = sorted(Path('tools/tmp/chef-source').glob('*.png'))
if len(sources) != 96:
    raise RuntimeError(f'Expected 96 frames, got {len(sources)}')

output = Path('public/chef')
output.mkdir(parents=True, exist_ok=True)
plate = Image.open(sources[0]).convert('RGB')

for index, path in enumerate(sources):
    frame = Image.open(path).convert('RGB')
    mask = Image.new('L', frame.size)
    draw = ImageDraw.Draw(mask)
    if index < 80:
        draw.rectangle((0, 110, 470, 265), fill=255)
    draw.rectangle((0, 525, 490, 720), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(16))
    frame = Image.composite(plate, frame, mask)

    top = frame.crop((0, 105, 1280, 200)).resize((1280, 105))
    top = top.filter(ImageFilter.GaussianBlur(18))
    frame.paste(ImageEnhance.Brightness(top).enhance(0.55), (0, 0))

    bottom = frame.crop((0, 625, 1280, 675)).resize((1280, 45))
    bottom = bottom.filter(ImageFilter.GaussianBlur(12))
    frame.paste(ImageEnhance.Brightness(bottom).enhance(0.6), (0, 675))

    frame.save(output / f'frame_{index:03d}.webp', quality=84, method=6)

Image.open(output / 'frame_000.webp').save(
    'public/kitchen-poster.webp', quality=85
)
```

આ code documentation example છે; હાલનો build તેને automatically run કરતો નથી. `Pillow` preparation machine માટે જોઈએ; final website માટે Python જોઈએ નહીં. Already supplied assets ચલાવવા ફરી generation/extractionની જરૂર નથી.

### આ cleanupની મર્યાદા

Static patch camera/background બદલાય ત્યારે seam અથવા ghosting આપી શકે છે. Mask subject ઉપર આવે તો હાથ, dough અથવા pizzaનો ભાગ પણ છુપાઈ શકે છે; તેથી mask range/shape tune કર્યા. Top/bottom blurred bands original clean 3D render પાછું બનાવતા નથી.

Higher-fidelity projectમાં clean source animation, background plate અને subject alpha renders મેળવવા વધુ યોગ્ય છે. Screen recording પાસે જ હોય તો crop/mask tradeoffs સમજાવીને કામ કરવું. Referenceના textને imageમાં જ રાખીને તેને accessible live heading કહી શકાય નહીં.

## 5. Final pizza assets શા માટે અલગ બનાવ્યા?

Sourceમાંથી ellipse crop/unwarp કરવાનો intermediate attempt કર્યો હતો, પણ screen background અને edge contamination rotation વખતે દેખાતા હતા. તે extracted texture final rendererમાં વપરાતી નથી.

Final base pair:

- Raw: round uncooked dough + tomato sauce + shredded cheese.
- Cooked: round wood-fired cheese pizza, browned crust.
- બંનેમાં selectable toppings પહેલેથી baked-in નથી.
- Toppings actual CSS layers તરીકે ઉમેરાય છે.
- Transparent backgroundથી rotation અને perspective પછી rectangular image box દેખાતો નથી.

જો base imageમાં pepperoni પહેલેથી હોય, તો checkbox off કરતાં pepperoni દૂર નહીં થાય. આથી state-driven customization માટે **neutral base અને separate options** જરૂરી છે.

`pizza-raw-base.png` archiveમાં compatibility માટે original unused file તરીકે છે. Active renderer `pizza-cheese-raw.webp` અને `pizza-cheese-baked.webp` import કરે છે. Fileનું નામ જોઈને usage માનવું નહીં; imports તપાસવા.

## 6. Clean builder plate

`kitchen-builder.webp` final chef poseવાળા kitchenનું generated clean image છે. Large floating pizza દૂર કરીને તેની જગ્યાએ separate live pizza layer મૂકી શકાય એવી scene તૈયાર કરી છે. Reference pose/composition promptમાં રાખવામાં આવી હતી, પણ generated plate sourceના દરેક pixelને perfectly preserve કરતી નથી.

Current renderer `p >= .62` પર plate તૈયાર હોય તો તેને use કરે છે. આ direct handover છે; optical-flow morph, continuous 3D camera transition અથવા perfect match-cut implementation નથી.

Final raw/cooked images તથા builder plate image-generation toolથી બનાવેલા project assets છે. તેઓ local compressed files તરીકે ચાલે છે. Website ચલાવતી વખતે કોઈ AI request થતી નથી. Recreating them from a prompt may produce a different image; bundled assets જ current result માટે authoritative છે.

## 7. Final asset inventory

Sizes bytesમાં છે; browser transfer અને decoded memory અલગ છે.

| Asset | Dimensions / format | Size | Role |
| --- | --- | --- | --- |
| `public/chef/frame_000.webp` … `frame_095.webp` | 96 × 1280 × 720, RGB WebP | 4,240,222 bytes total | Chef image sequence |
| `public/kitchen-poster.webp` | 1280 × 720 RGB WebP | 43,358 bytes | Initial scene fallback |
| `public/kitchen-builder.webp` | 1280 × 720 RGB WebP | 127,302 bytes | Interactive-stage background |
| `src/assets/images/pizza-cheese-raw.webp` | 600 × 600 RGBA WebP | 148,658 bytes | Transparent raw cheese pizza |
| `src/assets/images/pizza-cheese-baked.webp` | 600 × 600 RGBA WebP | 180,090 bytes | Transparent cooked cheese pizza |
| Existing delivery assets | Image files in `src/assets/images/` | See actual files | Night scene and scooter |
| Existing review assets | Five JPGs in `src/assets/images/` | See actual files | Review-card photos |
| Original reference MP4 | 1280 × 720 video | See actual file | Preserved reference; not the main player |

Source MP4 `public`માં હોવાથી normal Vite buildમાં copy થાય છે, પરંતુ page તેને automatically play/download કરતું નથી. Deployment artifact size અને actual first-page network transferને એકસરખાં માનવા નહીં. Future smaller deploymentમાં reference-only mediaને non-public documentation locationમાં મૂકી શકાય; આ docs update તે બદલેતું નથી.

## 8. Future reference માટે asset contract

નવી sequence export કરતાં આ બધું લખી આપવું:

1. File pattern અને indices; starting index 000 છે કે 001?
2. Total frames; source interval અને sampling rate.
3. દરેક frameની identical width/height, crop અને color handling.
4. Product center અને diameter source coordinatesમાં.
5. Clean background, raw object, cooked/final object, toppings અલગ layersમાં.
6. Top-down texture straight round હોવી; tilted perspective codeમાં apply કરવી.
7. Transparent imageમાં real alpha હોવું; black/white rectangle નહીં.
8. Stable subject pose/camera; regenerationથી anchor ખસે તો coordinates ફરી measure કરવા.
9. Poster અને last-frame fallback; missing asset behavior.
10. Asset origin, edit brief, source permission અને final file identityનો record.

Replacement asset મૂક્યા પછી માત્ર path બદલીને કામ પૂર્ણ ગણવું નહીં. Handover, rotation, alpha edge, crop અને mobile alignment ફરી verify કરવાં.
