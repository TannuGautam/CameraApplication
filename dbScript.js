let request = indexedDB.open("Camera", 1);
let db;

request.onsuccess = function(e){
    //if success
    db = request.result;
}

request.onerror = function(e){
    //if error occurs
    console.log("error");
}

request.onupgradeneeded = function(e)
{
    //if upgrade needed
    db = request.result;
    db.createObjectStore("gallery", {keyPath: "mId"});
};

function addMediaToGallery(data, type)
{
    //transaction
    let tx = db.transaction("gallery","readwrite");
    let gallery = tx.objectStore("gallery");
    gallery.add({mId: Date.now(),type,media:data});
}

function viewMedia()
{
    let body = document.querySelector("body");
    let tx = db.transaction("gallery","readonly");
    let gallery = tx.objectStore("gallery");
    let req = gallery.openCursor();

    req.onsuccess = function(e)
    {
        let cursor = req.result;

        if(cursor)
        {
            if(cursor.value.type == "video")
            {
                let vidContainer = document.createElement("div");

                vidContainer.setAttribute("data-mId", cursor.value.mId);

                vidContainer.classList.add("gallery-vid-container");

                let video = document.createElement("video");

                vidContainer.appendChild(video);

                //video deletion part
                let deleteBtn = document.createElement("button");

                deleteBtn.classList.add("gallery-delete-button");

                deleteBtn.innerText = "Delete";

                deleteBtn.addEventListener("click", deleteBtnHandler);

                //video downloading part
                let downloadBtn = document.createElement("button");

                downloadBtn.classList.add("gallery-download-button");

                downloadBtn.innerText = "Download";

                downloadBtn.addEventListener("click", downloadBtnHandler);

                vidContainer.appendChild(deleteBtn);

                vidContainer.appendChild(downloadBtn);

                video.autoplay = true;
                video.controls = true;
                video.loop = true;
                video.src = window.URL.createObjectURL(cursor.value.media);
                body.appendChild(vidContainer);

            }
            else
            {
                let imgContainer = document.createElement("div");

                imgContainer.setAttribute("data-mId",cursor.value.mId);

                imgContainer.classList.add("gallery-img-container");

                let img = document.createElement("img");

                img.src = cursor.value.media;

                console.log(cursor.value.media);

                imgContainer.appendChild(img);

                //img deletion part
                let deleteBtn = document.createElement("button");

                deleteBtn.classList.add("gallery-delete-button");

                deleteBtn.innerText = "Delete";
            
                deleteBtn.addEventListener("click", deleteBtnHandler);

                //img download part
                let downloadBtn = document.createElement("button");

                downloadBtn.classList.add("gallery-download-button");

                downloadBtn.innerText = "Download";
               
                downloadBtn.addEventListener("click", downloadBtnHandler);

                imgContainer.appendChild(deleteBtn);

                imgContainer.appendChild(downloadBtn);

                body.appendChild(imgContainer);
            }
            cursor.continue();
        }
    }
}

function deleteMediaFromGallery(mId)
{
    let tx = db.transaction("gallery","readwrite");

    let gallery = tx.objectStore("gallery");

    console.log(mId);

    //Typecasting to a number is imp because we have stored Date.now() 
    gallery.delete(Number(mId));
}

function deleteBtnHandler(e)
{
    let mId = e.currentTarget.parentNode.getAttribute("data-mId");

    deleteMediaFromGallery(mId);

    e.currentTarget.parentNode.remove();
}

function downloadBtnHandler(e)
{
    let a = document.createElement("a");

    a.href = e.currentTarget.parentNode.children[0].src;

    //checks if element is video or img so thar we can define the extension
    if(e.currentTarget.parentNode.children[0].nodeName == "IMG")
    {
        a.download = "image.png";
    }
    else
    {
        a.download = "video.mp4";
    }
    a.click();
    a.remove();
}















