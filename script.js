let videoElement = document.querySelector("video");

isRecording = false;


let recordBtn = document.querySelector(".record");

//user requirement send ie audio n video requirement

let constraint = {
    audio : true, video : true
}

//record future recording
let recording = [];

let mediarecordingObjectForCurrStream;

//promise
let usermediaPromise = navigator.mediaDevices.getUserMedia(constraint);

usermediaPromise.then(function (stream)
{
    //ui stream
    videoElement.srcObject = stream;

    //browser

    mediarecordingObjectForCurrStream = new MediaRecorder(stream);

    //camera recording addded into recording array

    mediarecordingObjectForCurrStream.ondataavailable = function(e)
    {
        recording.push(e.data);
    }

    //download
    mediarecordingObjectForCurrStream.addEventListener("stop", function()
    {
        //recording is coverted into url

        //type ie MIME type (extension)

        const blob = new Blob(recording, { type: 'video/mp4'});

        const url = window.URL.createObjectURL(blob);

        let a = document.createElement("a");

        a.download = "file.mp4";

        a.href = url;

        a.click();

        recording = [];
    })
})
.catch(function (err)
{
    alert("Please allow Microphone and Camera");
})

recordBtn.addEventListener("click", function()
{
    if(mediarecordingObjectForCurrStream == undefined)
    {
        alert("first select the devices");
        return;
    }

    if(isRecording == false)
    {
        mediarecordingObjectForCurrStream.start();
        recordBtn.innerText = "Recording.....";
    }
    else
    {
        mediarecordingObjectForCurrStream.stop();
        recordBtn.innerText = "Record";
    }
    isRecording = !isRecording; // making it false if true
})
