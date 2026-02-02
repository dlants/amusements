---
title: converting from openni map to opencv mat.
publishDate: 2012-06-19
shortUrl: mat-conversion
tags: [tech]
---

Today I was looking at my code to visualize my kinect recordings as they happen. I figured out a more efficient way to convert from openni maps to opencv mat structures by initializing an opencv mat from the openni data pointer. As always, for my future reference and for everyone out there, here is my code:

```c++
// Convert rgb map to a CV_8UC3 Mat with channel flipping. See below for more efficient
// version.

//void convert_pixel_map(const XnRGB24Pixel* pImageMap, Mat& cv_image, int rows, int cols)
//{
//  cv_image = Mat(rows, cols, CV_8UC3);
//  MatIterator_<Vec3b> it = cv_image.begin<Vec3b>();
//  
//  for (unsigned int i = 0; i < rows; i++) {
//    for (unsigned int j = 0; j < cols; j++) {
//      (*it)[0] = (pImageMap[i*cols + j]).nBlue;
//      (*it)[1] = (pImageMap[i*cols + j]).nGreen;
//      (*it)[2] = (pImageMap[i*cols + j]).nRed;
//      it++;
//    }
//  }
//}
 
 
// Let's try a more efficient visualization.
void convert_pixel_map(const XnRGB24Pixel* pImageMap, Mat& cv_image, int rows, int cols)
{
  int sizes[2] = {rows, cols};
  cv_image = Mat(2, sizes, CV_8UC3, (void*) pImageMap);
}
 
// Efficient!
void convert_pixel_map(const XnDepthPixel* pDepthMap, Mat& cv_depth, int rows, int cols)
{
  int sizes[2] = {rows, cols};
  cv_depth = Mat(2, sizes, CV_16UC1, (void*) pDepthMap);
}
// Should use this to visualize:  cv_depth.convertTo(cv_depth, CV_8UC1, 0.05f);
```

This works, except that openni stores pixel channels in the opposite order of opencv, so the r and b channels are inverted. Further, you should not edit the resulting Mat without copying it, as it is operating on the depthmap data, which is supposed to be a const pointer. In my code I am merely visualizing, so both of these are ok!

Here’s how to use it in code:

```c++
using namespace xn;
using namespace cv;
 
DepthGenerator g_depth;
ImageGenerator g_image;
 
// Init generators...
 
XnMapOutputMode imageMapMode;
XnMapOutputMode depthMapMode;
g_image.GetMapOutputMode(imageMapMode);
g_depth.GetMapOutputMode(depthMapMode);
 
Mat rgb;
Mat depth;
const XnDepthPixel* pDepthMap = g_depth.GetDepthMap();
const XnRGB24Pixel* pImageMap = g_image.GetRGB24ImageMap();
 
convert_pixel_map(pDepthMap, depth, depthMapMode.nYRes, depthMapMode.nXRes);
convert_pixel_map(pImageMap, rgb,   imageMapMode.nYRes, imageMapMode.nXRes);
 
// Use Mats...
 
// Important, since we initialized from remote pointers.
depth.release();
rgb.release();
```
