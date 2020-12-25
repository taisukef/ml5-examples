// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet using p5.js
=== */
/* eslint-disable */

// Grab elements, create settings, etc.
var video = document.getElementById("video");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// The detected positions will be inside an array
let poses = [];

// Create a webcam capture
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    video.srcObject = stream;
    video.play();
  });
}

// A function to draw the video and poses into the canvas.
// This function is independent of the result of posenet
// This way the video will not seem slow if poseNet
// is not detecting a position
function drawCameraIntoCanvas() {
  // Draw the video element into the canvas
  ctx.drawImage(video, 0, 0, 640, 480);
  ctx.strokeStyle = "rgb(255, 255, 255)";
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
  window.requestAnimationFrame(drawCameraIntoCanvas);
}
// Loop over the drawCameraIntoCanvas function
drawCameraIntoCanvas();

// Create a new poseNet method with a single detection
const poseNet = ml5.poseNet(video, modelReady);
poseNet.on("pose", gotPoses);

// A function that gets called every time there's an update from the model
function gotPoses(results) {
  poses = results;
  //console.log(poses);
  /*
  keypoints
0: {score: 0.9302153587341309, part: "nose", position: {…}}
1: {score: 0.9916467070579529, part: "leftEye", position: {…}}
2: {score: 0.9973408579826355, part: "rightEye", position: {…}}
3: {score: 0.07444975525140762, part: "leftEar", position: {…}}
4: {score: 0.8985944390296936, part: "rightEar", position: {…}}
5: {score: 0.0007669468759559095, part: "leftShoulder", position: {…}}
6: {score: 0.08461932092905045, part: "rightShoulder", position: {…}}
7: {score: 0.0004988888395018876, part: "leftElbow", position: {…}}
8: {score: 0.0048105595633387566, part: "rightElbow", position: {…}}
9: {score: 0.0008258619927801192, part: "leftWrist", position: {…}}
10: {score: 0.005645880475640297, part: "rightWrist", position: {…}}
11: {score: 0.00029717653524130583, part: "leftHip", position: {…}}
12: {score: 0.0025042772758752108, part: "rightHip", position: {…}}
13: {score: 0.0014438348589465022, part: "leftKnee", position: {…}}
14: {score: 0.0038876007311046124, part: "rightKnee", position: {…}}
15: {score: 0.0007630433537997305, part: "leftAnkle", position: {…}}
16: {score: 0.0028100707568228245, part: "rightAnkle", position: {…}}
  */
}

function modelReady() {
  console.log("model ready");
  poseNet.multiPose(video);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i += 1) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j += 1) {
      let keypoint = poses[i].pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i += 1) {
    // For every skeleton, loop through all body connections
    for (let j = 0; j < poses[i].skeleton.length; j += 1) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      ctx.beginPath();
      ctx.moveTo(partA.position.x, partA.position.y);
      ctx.lineTo(partB.position.x, partB.position.y);
      ctx.stroke();
    }
  }
}
