const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchArea = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const search = document.getElementById('search');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';



// show images 
const showImages = (images) => {
// Clear input field
search.value = "";


 // Show loading spinner
 loadingSpinner();

if(images.length < 1){
  imagesArea.style.display = 'none';
  document.getElementById("no-img-found").classList.remove("d-none");
}
else{
   imagesArea.style.display = 'block';
   document.getElementById('errorMessage').style.display = "none";
   gallery.innerHTML = '';


  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
  })
}
}

const getImages = (query) => {
  loadingSpinner();
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => {
      if (data.total == 0) {
        document.getElementById('errorMessage').style.display = "block";
        loadingSpinner();
      }
      else{
        showImages(data.hits);
      }
    } )
    .catch(err => function(){
      imagesArea.style.display = 'block';
      imagesArea.innerHTML = "<h5> Your search didn't match to any item </h5>";
      
    })

}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  ;
 
  // select item and deselect and update slider length
  let item = sliders.indexOf(img);
  if (item === -1) {
    element.classList.toggle("added")
    sliders.push(img);
  } else {
    element.classList.toggle("added")
    sliders.splice(item,1);
  }
}

let timer
const createSlider = () => {
  const duration = document.getElementById('duration').value * 1000 || 1000;
  if (duration > 0) {
    // check slider image length
  if (sliders.length < 2) {
    alert('You have to select atleast 2 images')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
  }
  else{
    alert('Please set the slide duration time upto 0 second and try again');
  }
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

search.addEventListener("click", function(event){
  if (event.key == "Enter") {
    searchBtn.click();
  }
})

// search by pressing Enter key
search.addEventListener("keypress",function(event){
  if(event.key === "Enter"){
    event.preventDefault();
    searchBtn.click();
  }
})



searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = searchArea;
  getImages(search.value)
  sliders.length = 0; 
  document.getElementById("no-img-found").classList.add("d-none");
  imagesArea.style.display = 'none';
  document.getElementById("image-container").innerHTML = "";
  
  });

// Create slider on click button
sliderBtn.addEventListener('click', function () {
  createSlider()
})

// Display spinner
const loadingSpinner = ()=>{
  const spinnerContainer = document.getElementById('spinner');
  spinnerContainer.classList.toggle("d-none");

}