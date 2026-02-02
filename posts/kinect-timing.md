---
title: kinect timing issues
publishDate: 2012-06-18
shortUrl: kinect-timing
tags: [tech]
---

While dealing with data in multiple modalities (sound, accelerometry, video), or even just data collected by multiple sensors, one serious and often unexpected issue is synchronization. In my current project, I ran into a problem with synchronizing my kinect recordings. This lead me to investigate the issue of keeping consistent time in kinect. While using OpenNI and their supported recording format (.oni), I discovered that the kinect and the Asus XTION Pro sensor had some issues keeping up with their reported FPS settings. Not all hope is lost, however, since kinect recording automatically time stamps every frame, so with a bit of effort one can easily interpolate existing recordings and retrieve recordings with consistent FPS. In this post, I will explain everything in detail and provide code that you can use to record data with optimal fps, as well as interpolate kinect recordings and output lossless avi video of the rgb and depth channels.

So, what do I mean by consistent timing, and why is it an important issue to keep in mind? Well, consider a Kinect recording in a typical setup – running as one of many processes on a machine while providing visualization of every frame that it collects. Below is my code for doing this in OpenCV 2.3.1 and OpenNI 1.5.4.0:

```c++
// Set everything up... see file record.cpp in attachment for full code.
#define VISUALIZE

//...
mapMode.nFPS = 30;
g_depth.SetMapOutputMode(mapMode);
g_image.SetMapOutputMode(mapMode);
//...

// Recording loop
while(cv::waitKey(1) != 1048603) { // Wait for esc key.
  // Get new data when available
  nRetVal = g_image.WaitAndUpdateData();
  if (nRetVal != XN_STATUS_OK) {
    printf("Failed updating: %s\n", xnGetStatusString(nRetVal));
    return false;
  }
  nRetVal = g_depth.WaitAndUpdateData();
  if (nRetVal != XN_STATUS_OK) {
    printf("Failed updating: %s\n", xnGetStatusString(nRetVal));
    return false;
  }
  recorder.Record();

#ifdef VISUALIZE
  // Visualize
  pDepthMap = g_depth.GetDepthMap();
  pImageMap = g_image.GetRGB24ImageMap();

  // My own functions, defined in record.cpp
  convert_pixel_map(pDepthMap, depth, mapMode.nYRes, mapMode.nXRes);
  convert_pixel_map(pImageMap, rgb, mapMode.nYRes, mapMode.nXRes);

  cv::imshow("rgb", rgb);
  cv::imshow("depth", depth);
#endif
}
```

I analyzed the above recordings, and these are some figures I produced:

![](/images/kinect-timing/abc.png)

![](/images/kinect-timing/abc-1.png)

![](/images/kinect-timing/abc-2.png)

The leftmost image is the number of frames dropped on the y axis, and the frame into the recording on the x axis. The second image shows a log of how the FPS of recording vary as the recording progresses. Finally, the last graph is a histogram of how the FPS was distributed in the recording. You can clearly see that on a busy machine with visualization, the Kinect gets nowhere close to the 30 FPS it’s supposed to record, and most of the time hovers around 27 FPS. This means that if you are trying to synchronize against this recording using the FPS, by 1 minute into the recording you’ll be about 6 seconds off. Also, if you are trying to analyze the accelerations or the amount of movement in the recording, about every 10th frame you may get faulty readings from the frame rate fluctuating up and down.

Even if you record on a dedicated machine, using an Asus XTION Pro sensor (which is capable of going up to 60 FPS), the above code with the VISUALIZATION flag removed produces the following figures:

![](/images/kinect-timing/framesdroppedkitchen.png)

![](/images/kinect-timing/fpslogkitchen.png)

![](/images/kinect-timing/fpskitchen.png)

As you can see, the frame rate is much more consistent and stays at 30fps most of the time. Nonetheless, you still experience occasional slowness and as a consequence – drift. In this case, the drift is about 1% of frames, as opposed to the 10% in the code above.

As I mentioned before, there is hope. Thankfully, the people at OpenNI were kind enough to time stamp every frame the recorder collects down to the microsecond, and these time stamps are accessible in the OpenNI player. Using this information, I wrote a script to interpolate the recording with duplicates of the current frame, when the recording drifts by more than 1 frame of where it should be. Here are the important parts of that code (full code in attachment).

```c++
// How to access timestamps.
xn::XnUInt32 frame;
xn::XnUInt64 timestamp;
xn::Player player;

// ...

player.TellFrame(depthname, frame);
player.TellTimestamp(timestamp);

// ...

// My code for interpolation.
// Increment frameswritten whenever you write a new frame to the file.
int msframe = 33333; // microseconds per frame
while(frameswritten+1 < timestamp/msframe) {
  rgbwriter.write(rgb);
  depthwriter.write(depth);
  frameswritten++;
  printf("Frame %d filled.\n", frameswritten);
}
```

Using the code I provide in the attached files, you should be able to split your oni files into separate depth and rgb streams, and save them in lossless avi format, while correcting for variable FPS in the recording. There is also python code for reading these files using the opencv python bindings.

I’ll add a few more posts on this topic, giving code snipplets for doing various things, like converting OpenNI depth and rgb maps to opencv Mats, expanding the 16 bit depth map into two channels of rgb video, and collapsing it back with python opencv bindings. Still, everything you need should be in the following code package:

<dead link, sorry> (blame bitbucket)
