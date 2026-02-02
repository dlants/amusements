---
title: lossless video recording with opencv
publishDate: 2012-08-31
shortUrl: lossless-opencv
tags: [tech]
---

In my work it is really important that I save pixel-perfect lossless video through opencv. I prefer prototyping in python, which unfortunately doesn’t have friendly openni bindings. My solution has been to convert my openni recordings to two separate video files. In order to convert the 16 bit depth stream to an 8 bit 3 channel video, I put the first 8 bits into the red channel and the second 8 bits into the green channel.

Up until a little while ago, I was using the opencv fourcc codec 0 for this. This used to default to an uncompressed video file which, despite its size, looked perfect when I reconstructed my depth image from the two channels of the video. This resulted in a .avi file with codex 0x00000000, and mediainfo told me that this was the Basic Windows bitmap format. 1, 4 and 8 bit.

Then, after an ubuntu update, I suddenly stopped being able to read those files. The new files that were recorded (with codec 0) had artifacts in reconstruction. After a bit of confusion I realized that opencv started thinking of codec 0 as a default setting and switching the format to I420. This is supposed to be a lossless codec, but I think either the conversion to YUV or the chroma subsampling that was screwing over my reconstruction.

I tried a variety of lossless codecs available through opencv, but they either gave me similar artifacts or did not work. For instance, I could never get ‘DIB ‘ to work, despite it being recommended on the opencv codec page. Insead I got the following error:

```c++
OpenCV-2.4.1/modules/highgui/src/cap_gstreamer.cpp:483: error: (-210) Gstreamer Opencv backend doesn't support this codec acutally. in function CvVideoWriter_GStreamer::open
Aborted (core dumped)
```

After consulting with a senior student in my program, who is familiar with ffmpeg, I arrived at the following hack, which avoids using the VideoWriter object to save lossless video. The idea is to use imwrite to save each frame of the video to a .png file, and then stitch them all together via ffmpeg into an mov file. The resulting files have codec 0x20676E70, with id png – Portable Network Graphic. Strangely, opencv is capable of reading these files, even though it gives a similar gstreamer error when trying to write them.

Without further ado, here is the code I used to save each depth frame as a png. Create a folder outimg in the same folder as your video. Then,

```c++
std::ostringstream out_depth;
...
expand_depth(playback.pDepthMap, expanded_depth, playback.rows, playback.cols);
out_depth << root << "/outimg/depth" << framecount << ".png";
cv::imwrite(out_depth.str(), expanded_depth);
framecount++;
...
```

You can find the playback object and the expand_depth function in my older post on splitting openni recordings.

Next, the magic happens with the following command:

```c++
ffmpeg -i ./outimg/depth%d.png -vcodec png depth.mov
```

I installed ffmpeg along with opencv, according to [these](http://www.ozbotz.org/opencv-installation/) instructions.

Hopefully this gives you all enough to go on!


