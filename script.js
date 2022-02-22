// const wrapper = document.querySelector(".wrapper");
//          const fileName = document.querySelector(".file-name");
//          const defaultBtn = document.querySelector("#default-btn");
//          const customBtn = document.querySelector("#custom-btn");
//          const cancelBtn = document.querySelector("#cancel-btn i");
//          const img = document.querySelector("img");
//          let regExp = /[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/;
//          function defaultBtnActive(){
//            defaultBtn.click();
//          }
//          defaultBtn.addEventListener("change", function(){
//            const file = this.files[0];
//            if(file){
//              const reader = new FileReader();
//              reader.onload = function(){
//                const result = reader.result;
//                img.src = result;
//                wrapper.classList.add("active");
//              }
//              cancelBtn.addEventListener("click", function(){
//                img.src = "";
//                wrapper.classList.remove("active");
//              })
//              reader.readAsDataURL(file);
//            }
//            if(this.value){
//              let valueStore = this.value.match(regExp);
//              fileName.textContent = valueStore;
//            }
//          });

//selecting all required elements
const dropArea = document.querySelector(".drag-area"),
dragText = dropArea.querySelector("header"),
button = dropArea.querySelector("button"),
input = dropArea.querySelector("input");
let file; //this is a global variable and we'll use it inside multiple functions

button.onclick = ()=>{
  input.click(); //if user click on the button then the input also clicked
}

input.addEventListener("change", function(){
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  for (let i = 0; i < this.files.length; i++) {
    file = this.files[i];
    console.log(file);
    dropArea.classList.add("active");
    showFile(); //calling function
  }
});


//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", ()=>{
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  for (let i = 0; i < this.files.length; i++) {
  file = event.dataTransfer.files[i];
  console.log(file);
  showFile(); //calling function
  }
});

function showFile(){
  let fileType = file.type; //getting selected file type
  let validExtensions = ["image/jpeg", "image/jpg", "image/png"]; //adding some valid image extensions in array
  if(validExtensions.includes(fileType)){ //if user selected file is an image file
    let fileReader = new FileReader(); //creating new FileReader object
    fileReader.onload = ()=>{
      let fileURL = fileReader.result; //passing user file source in fileURL variable
        // UNCOMMENT THIS BELOW LINE. I GOT AN ERROR WHILE UPLOADING THIS POST SO I COMMENTED IT
      let imgTag = `<img src="${fileURL}" alt="image">`; //creating an img tag and passing user selected file source inside src attribute
      dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
    }
    fileReader.readAsDataURL(file);
  }else{
    alert("This is not an Image File!");
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}