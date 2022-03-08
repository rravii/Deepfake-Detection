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
                const mainCard = document.createElement('div')
                mainCard.classList = 'card mb-2'
                const row = document.createElement('div')
                row.classList = 'row align-items-center'
                const col5 = document.createElement('div')
                col5.classList = 'col-sm-4 p-2'
                // div.style.minWidth = '5rem';
                const image = document.createElement('img')
                image.classList = 'card-img rounded-circle out-img'
                image.src= item.url
                col5.appendChild(image)
                const col7 = document.createElement('div')
                col7.classList = 'col-sm-8'
                const cardBody = document.createElement('div')
                cardBody.classList = 'card-body'
                const cardTitle = document.createElement('h5')
                cardTitle.classList = 'card-title c-title'
                cardTitle.innerText = item.result
                const cardText = document.createElement('h5')
                cardText.classList = 'c-text'
                cardText.innerText = item.percent + "%"
                cardBody.appendChild(cardTitle)
                cardBody.appendChild(cardText)
                col7.appendChild(cardBody)
                row.appendChild(col5)
                row.appendChild(col7)

                mainCard.appendChild(row)
                holderElement.prepend(mainCard)
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