Dropzone.autoDiscover = false;

const myDropzone = new Dropzone("#my-dropzone",{
    url: 'upload/',
    // maxFiles: 2,
    maxFilessize: 10, //MB
    acceptedFiles: '.jpg,.png'
})

// for overlay
function on() {
    document.getElementById("overlay").style.display = "block";
  }
  
function off() {
    document.getElementById("overlay").style.display = "none";
}


// popup credentials

function popupFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}