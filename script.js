let videoElement = document.querySelector("video");

let isRecording = false;

let recordBtn = document.querySelector(".record");

let captureImgBtn = document.querySelector(".capture");

//adding colored filters
let filterArr = document.querySelectorAll(".filter");

let filterOverlay = document.querySelector(".filter_overlay");

let filterColor= "";

//zoomin n zoomout
let zoominBtn = document.querySelector(".plus");

let zoomoutBtn = document.querySelector(".minus");

let scaleLevel = 1;

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
        //recordBtn.innerText = "Recording.....";

        //animation
        recordBtn.classList.add("record-animation");

        //timer started --> startTimer() function called
        startTimer();

    }
    else
    {
        //stop timer -> stopTimer() function call
        stopTimer();
        mediarecordingObjectForCurrStream.stop();
        //recordBtn.innerText = "Record";

        //animation
        recordBtn.classList.remove("record-animation");
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

    //zoom part
    tool.scale(scaleLevel,scaleLevel);

    const x = (tool.canvas.width / scaleLevel - videoElement.videoWidth);

    const y = (tool.canvas.height / scaleLevel - videoElement.videoHeight);

    captureImgBtn.classList.add("capture-animation");

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

    //animation
    setTimeout(function () {
        captureImgBtn.classList.remove("capture-animation");
    }, 1000)

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
}


function stopTimer()
{
    timings.style.display = "none";

    clearInterval(clearObj);
}

//zoomin n zoomout 
zoomoutBtn.addEventListener("click", function()
{
    if(scaleLevel > 1)
    {
        scaleLevel = scaleLevel - 0.1;
        videoElement.style.transform = `scale(${scaleLevel})`;
    }
})

zoominBtn.addEventListener("click", function()
{
    if(scaleLevel < 1.7)
    {
        scaleLevel = scaleLevel + 0.1;
        videoElement.style.transform = `scale(${scaleLevel})`;
    }
})

