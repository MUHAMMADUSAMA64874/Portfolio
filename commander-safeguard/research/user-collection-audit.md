# User research collection audit

Audit date: 2026-07-29  
Source initially audited at: `Safeguard/`  
Files reviewed: 59  
Total supplied bytes: 337,604,797

This audit keeps private/user-supplied research separate from timestamped Internet Archive captures. On 2026-07-30, the owner requested removal of the invalid `.swf`-named HTML responses and unrelated modern HTML reconstructions; their hashes and rejection findings remain recorded here.

## Newly exposed video material

All six files have valid ISO Base Media / MP4 signatures. Windows media metadata was used for duration and dimensions. They do not match any SHA-256 hash in the downloaded Wayback payload set.

| Supplied filename | Duration | Dimensions | Bytes | SHA-256 |
|---|---:|---:|---:|---|
| `Commander Safeguard - Mission Clean Sweep Total 10.mp4` | 15:30 | 540×360 | 62,785,096 | `EF1AEF19A21EB9180244B819C8180928943E78DAAABF33C88A9BFD806F4C4BBC` |
| `Commander Safeguard Cleansweep....... - YouTube.webm.mp4` | 08:03 | 352×240 | 19,911,195 | `0CF218679C88BDA5E422577C70FFF750D18A36ECCE8C85824358FF6D2B1C01DF` |
| `Commander Safeguard's - Mission Clean Sweep_ 20 Twenty.mp4` | 18:49 | 480×360 | 57,247,627 | `FB177066296002F685C07C118E02D22796E0C7FBF595F0E3BE4A4C7C4AA61E9A` |
| `Commander Safeguard's - Mission Clean Sweep_ Complete 5.mp4` | 11:28 | 480×360 | 45,463,917 | `FABECA97459E7CD5EA767B546B3D89A6631C61A80637E7E2314AC3BF75AE57A8` |
| `Commander Safeguard's - Mission Clean Sweep_ Double Trouble (1).mp4` | 12:12 | 480×360 | 48,159,814 | `812820FFC2D67C42F637EC2825C51DBD35126AAE5ACC7C7C5D65978F8D1642CB` |
| `videoplayback.mp4` | 18:52 | 480×360 | 83,656,610 | `7D8B3AEB7647CFD6501F6B048CD2E3C69602BAA9AB3363B7B63B274DB3FACA65` |

`videoplayback.mp4` has no embedded or filename title, so the museum labels it “Unidentified supplied episode” rather than guessing.

## Newly used reference stills

These files have valid image signatures but no timestamped Wayback provenance. They are therefore labeled as user-supplied video stills.

| Use | Supplied filename | Bytes | SHA-256 |
|---|---|---:|---|
| Germander catalogue reference | `character/Image.jpg` | 8,697 | `85D3B48E77E82FF257D919794D4E739A2D166F8881FF53338C2FC8AC7B0E71FA` |
| Paleeda catalogue reference | `character/Paleeda.jpeg.jpeg` | 11,765 | `4368615A473FDEC602C9B935C05112E6976BCFD47F8695DF2050EE527D738A6D` |
| Later-site layout reference | `bg.jpg` | 126,995 | `A13C2DD195539276CC9823C4EFCA8F38B06311EFE92921FAA75BA29B1FFFD397` |

The enlarged `pixelcut-export.jpeg` is retained in the source folder but not used by the museum because it is a later enhancement of the layout reference.

## Exact duplicates already preserved from Wayback

The following user files match downloaded Wayback blobs byte for byte, so the museum continues to serve its timestamped archive copies:

- `Dowload/DurhamBurham_Video.mpg`
- `Dowload/Holidayhungamapromo_Video.wmv`
- `Dowload/TripleImpactDhamaka.wmv`
- `character/color_1.jpeg` through `character/color_5.jpeg`

## False SWF downloads

None of the 13 `.swf`-named files had a Flash signature (`FWS`, `CWS`, or `ZWS`). Each began with HTML and contained either a parked-domain page or an Internet Archive interface/error response. They were removed after this audit:

- `2020cricket.swf`
- `announcement20.swf`
- `Banner.swf`
- `Bgame.swf`
- `Characters2.swf`
- `game.swf`
- `germ_fighterII.swf`
- `germi.swf`
- `germi (1).swf`
- `intro.swf`
- `intro (1).swf`
- `logo.swf`
- `newbanner.swf`

Most importantly, `Characters2.swf` and `game.swf` are identical 800-byte parked-domain HTML documents. `germ_fighterII.swf` is a different 800-byte parked-domain response. They do not close the three corresponding archive gaps.

## Modern experiments removed

The custom `home.html`, character page, shooter, maze, bike challenge, and sprite test were records of prior reconstruction work. They used modern HTML, third-party assets, generic prose, or incomplete code, so they were removed from `Safeguard/` at the owner's request and are not represented as original site pages or games.
