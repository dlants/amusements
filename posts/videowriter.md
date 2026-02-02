---
title: open a videowriter based on a videocapture
publishDate: 2012-06-15
shortUrl: videowriter
tags: [tech]
---

Several things are tricky about this one:

- the get() function in opencv always returns a float, so we have to cast it to the appropriate values.
- the get() function flags are defined in cv, and not cv2.
- there is no Size() object in python, instead we need a tuple of ints
- the size the video expects is in the order of width, height – so columns, rows

```c++
import cv
import cv2
import sys
 
samplecap = cv2.VideoCapture(filename)
 
if not samplecap.isOpened():
  print "Error: could not open capture " + filename + ".\n"
  sys.exit()
 
framesize = (int(samplecap.get(cv.CV_CAP_PROP_FRAME_WIDTH)), int(samplecap.get(cv.CV_CAP_PROP_FRAME_HEIGHT)))
 
samplewriter = cv2.VideoWriter()
samplewriter.open(outname,
  int(samplecap.get(cv.CV_CAP_PROP_FOURCC)),
  int(samplecap.get(cv.CV_CAP_PROP_FPS)),
  framesize)
```


