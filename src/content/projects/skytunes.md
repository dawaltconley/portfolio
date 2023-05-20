---
draft: true
title: SkyTunes
links:
  - https://skytunes.app
  - https://github.com/dawaltconley/skytunes
tags:
  - app
  - audio
  - typescript
---

An application using audio synthesis to render the meridian transit of stars.

## Optimization

Failed caching
  - `CacheItem` class
  - memoization

### Invisible stars

Optimization involved sorting them by time to rise.
  - linked list?
  - setTimeout (scheduling each star rise)
  - binary insertion

In theory both should be O(n), but JS seems to optimize Array.

### From job app

I've been trying to rebuild a personal project, which I original wrote in 
SuperCollider, as a web app. This project (currently viewable at skytunes.app) 
uses the position of stars in the sky to trigger audio synths, and it 
visualizes this using an interactive star map.

I have been exploring various optimizations while rebuilding this project. It 
was one of the first things I built while learning to code and originally 
performed poorly. I was able to improve the performance significantly by 
removing all stars below the horizon from the main event loop until they became 
visible again. I accomplished this by maintaining these hidden stars in a 
sorted array, sorting by their angle to the eastern horizon. Each time a star 
sets below the horizon, it is added to the sorted array using binary insertion. 
Then, on each animation loop, the hidden stars are checked in order, starting 
at the closest to the horizon, only until one is encountered that is still 
below the horizon.

The binary insertion itself still has an O(n) time complexity because it 
splices the new star into the sorted array. But since it only runs when a new 
star needs to set, rather than on every animation frame, this is a major 
performance improvement.
