Dropzone.autoDiscover = false;

const myDropzone = new Dropzone("#my-dropzone",{
    url: 'upload/',
    // maxFiles: 2,
    maxFilessize: 10, //MB
    acceptedFiles: '.jpg,.png',
    success: function(file,response){
        console.log(response, 'from server')
        const res = JSON.parse(response)
        const holderElement = document.getElementById('classificationResult')
        if(res && 'images' in res){
            res.images.forEach(item=>{
                const div1 = document.createElement('div')
                div1.classList = 'card'
                const div2 = document.createElement('div')
                div2.classList = 'card row no-gutters'
                const div3 = document.createElement('div')
                div3.classList = 'col-sm-5'
                // div.style.minWidth = '5rem';
                const image = document.createElement('img')
                image.classList = 'card-img rounded-circle'
                image.src= item.url
                div3.appendChild(image)
                const div4 = document.createElement('div')
                div4.classList = 'col-sm-7'
                const cardBody = document.createElement('div')
                cardBody.classList = 'card-body'
                const cardTitle = document.createElement('h5')
                cardTitle.classList = 'card-title'
                cardTitle.innerText = item.result
                const cardText = document.createElement('p')
                cardText.innerText = 'Percent:' + item.result
                cardBody.appendChild(cardTitle,cardText)
                div4.appendChild(cardBody)
                div2.appendChild(div3,div4)
                div1.appendChild(div2)
                holderElement.prepend(div1)
            })
        }

    }
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