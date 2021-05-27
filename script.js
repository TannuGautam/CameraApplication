let videoElement = document.querySelector("video");

let isRecording = false;

let recordBtn = document.querySelector(".record");

let captureImgBtn = document.querySelector(".capture");

let filterArr = document.querySelectorAll(".filter");

let filterOverlay = document.querySelector(".filter_overlay");

let filterColor= "";

//timer 
let timings = document.querySelector(".timing");

let counter = 0;

let clearObj;

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

        //timer started --> startTimer() function called
        startTimer();

    }
    else
    {
        //stop timer -> stopTimer() function call
        stopTimer();
        mediarecordingObjectForCurrStream.stop();
        recordBtn.innerText = "Record";
    }
    isRecording = !isRecording; // making it false if true
})



captureImgBtn.addEventListener("click", function()
{
    //canvas create
    let canvas = document.createElement("canvas");

    canvas.height = videoElement.videoHeight;

    canvas.width = videoElement.videoWidth;

    let tool = canvas.getContext("2d");

    tool.drawImage(videoElement, 0 , 0);

    //adding filters to video element that will be captured.
    if(filterColor)
    {
        tool.fillStyle = filterColor;

        tool.fillRect(0,0,canvas.width,canvas.height);
    }

    let url = canvas.toDataURL();

    let a = document.createElement("a");

    a.download = "file.png";

    a.href = url;

    a.click();

    a.remove();
})

//filter array
for(let i = 0; i < filterArr.length; i++)
{
    filterArr[i].addEventListener("click", function()
    {
        filterColor = filterArr[i].style.backgroundColor;

        filterOverlay.style.backgroundColor = filterColor;
    })
}

//timer logiccc

function startTimer()
{
    timings.style.display = "block";

    function fn()
    {
        //hours
        let hours = Number.parseInt(counter / 3600);

        //seconds
        let remSeconds = counter % 3600;

        let seconds = remSeconds % 60;

        //minutes
        let mins = Number.parseInt(remSeconds / 60);

        hours = hours < 10 ? `0${hours}` : hours;

        seconds = seconds < 10 ? `0${seconds}` : seconds;

        mins = mins < 10 ? `0${mins}` : mins;

        timings.innerText = `${hours}:${mins}:${seconds}`;

        counter++;

    }

    clearObj = setInterval(fn, 1000);
    
    function stopTimer()
    {
        timings.style.display = "none";

        clearInterval(clearObj);
    }
}