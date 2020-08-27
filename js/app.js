const video = document.getElementById("video")

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')

]).then(getVideo)




function getVideo(){

 navigator.mediaDevices.getUserMedia({video: true})
    .then(show => {video.srcObject=show;} )
    .catch(e => { console.log("catch error!"+""+ e)})

} 

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = {height: video.height , width: video.width }
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const finalDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, finalDetections)
        faceapi.draw.drawFaceLandmarks(canvas, finalDetections)
        faceapi.draw.drawFaceExpressions(canvas, finalDetections)
      }, 100)

})
