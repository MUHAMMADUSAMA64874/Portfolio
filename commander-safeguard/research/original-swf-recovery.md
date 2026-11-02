# Original SWF recovery audit

Updated: 2026-07-30

## Preservation rule

Only byte-valid Flash files with traceable Commander Safeguard provenance qualify as playable games. HTML reimplementations, similarly named third-party games, parked-domain pages saved with `.swf` extensions, and modified SWFs are excluded.

## Complete local scan

- Scanned all 879 archived URL records and all 767 locally recovered archive blobs across the 2005–2016 captures.
- Extracted 71 distinct SWF URLs referenced by the preserved HTML.
- Found 11 valid archived SWF records representing 10 distinct files. Every one passes its `FWS`/`CWS` signature check, zlib decompression where applicable, and declared uncompressed-length check.
- Scanned the 13 `.swf`-named files formerly in the supplied `Safeguard/character/` folder. None was Flash; all were HTML error, replay, or parked-domain responses, and they were removed at the owner's request after their hashes were recorded.
- Scanned the workspace for ZIP, RAR, and 7z containers and for SWF signatures embedded inside other archived blobs. No hidden game payload was found.

The original game files currently eligible for the Games catalogue are:

| Game | Surviving original payload | SHA-256 |
|---|---|---|
| 2020 Cricket | `games/2020cricket.swf` | `C488FE1CF826506DB5FDFD1873C942A8360D77A6818EB45AAF4769F45B516045` |
| The Bike Challenge | `games/bikegame/bgame.swf` | `89C64A4830EBD00CA17985A97EFC218EAF715B8173686B7EA5169315397BD74F` |
| Germ Maze | `games/germmaze.swf` | `616899664137593C868C11A8C63DE7DAC4E88DDD4FFC435B087C75E37F12783F` |
| Germ Attack | `games/germattack.swf` | `85BD06F5ADD995B020360D7FAC055211E8FF8CA4B7C1AC2434D6F9D0FE2B1560` |
| Ship Game | `games/ship game-intro.swf` (original intro only) | `C5929BE4995EC1D748CE6CB8A60DC88935E13269DC7B5D25ADDD13616BB5D7CE` |

The authentic `games/germfighter/intro.swf` also survives, but the separate main `game.swf` does not. It is therefore evidence, not a playable full game entry.

## External recovery search

The search covered exact filenames, capitalization variants, both historical domains, the older `/flash/games/` paths, and an external mirror referenced by the site.

- **Internet Archive:** 33 exact target URL variants were checked. No valid missing SWF was found. Three later captures for `game.swf`, `germ_fighterII.swf`, and `color_1.swf` are `text/html` parked-domain pages, not Flash.
- **Arquivo.pt:** the same 33 exact targets returned no captures.
- **Common Crawl:** all 44 collections from 2008–2017 were attempted for the two historical domains and the external GHD mirror. The batch log records endpoint timeouts/errors; successful direct checks of the representative 2008–2010, 2012, 2013, and 2015 indexes returned no SWF captures.
- **Flashpoint:** current searches for Commander Safeguard and both source domains returned no entries.
- **Internet Archive uploaded collections:** title, description, subject, identifier, and source-domain searches returned no packaged Commander Safeguard software collection.
- **Exact web searches:** the missing filenames and domain paths produced no downloadable original copy.

An independent Y8/POG file titled **Germ Fighter** was downloaded to quarantine and inspected. It is a valid `CWS` v9 game by 123Bee, SHA-256 `7729E3FC2A7BFC755EA2BA5A7941731FF34CFBA96E013A23D1A1D4B007352651`, but it has unrelated bee/alien artwork and Spacebar controls. It is not the Commander Safeguard game and was rejected.

The old site also references `ghd2008/Ghd_Game.swf`, and an archived `karachiplus.com/ghd/ghd_game.htm` wrapper confirms the same filename. Neither host has a captured SWF payload, so this newly documented game remains an archive gap.

## Missing original game payloads

- `games/germfighter/game.swf`
- `games/germfighter2/germ_fighterII.swf`
- `games/color_1.swf` through `games/color_5.swf`
- `games/color12.swf`
- `games/jigsaw_1.swf` through `games/jigsaw_5.swf`, including the older `/flash/games/` variants
- `ghd2008/Ghd_Game.swf`

These files are absent, not damaged. There are no original SWF bytes to repair. Rebuilding them would create a new derivative and would not be an authentic recovery, so no reconstruction is published.
