import Tmdb from "./tmdb.js"

// data source
const tmdb = new Tmdb
let dailyTrends = await tmdb.getMovieTrendingDaily()
dailyTrends = dailyTrends.results


// dom elements
const carouselSection = document.getElementById('slider')
const carouselInner = document.querySelector('.carousel-inner')
const carouselItemTemplate = document.querySelector('#carousel-items-template')


function addCarouselContent(){
    // get three random trending today movies and show them in carousel
    const randomNumbers = randomThree(dailyTrends)
    randomNumbers.forEach((number) => {
        const movie = dailyTrends[number]
        // skip if no backdrop image
        if(movie.backdrop_path == undefined || movie.backdrop_path === '') return 
        const ct = carouselItemTemplate.content.cloneNode(true)
        ct.querySelectorAll('[data-caro-title]').forEach((item) => {
            item.innerHTML = movie.title
        })
        ct.querySelectorAll('[data-caro-reviews]').forEach((item) => {
            item.innerText = `${(movie.vote_average).toFixed(1)}`
        })
        ct.querySelectorAll('[data-caro-year]').forEach((item) => {
            item.innerText = movie.release_date
        })
        // set character limit for description without cutting words
        let description = movie.overview
        if(description.length > 170){
            description = description.substring(0, 170)
            description = description.substring(0, description.lastIndexOf(' '))
            description += ' ...'
        }
        ct.querySelector('[data-caro-description]').innerText = description
        ct.querySelectorAll('[data-caro-details-btn]').forEach((item) => {
            item.href = `/movie.html?id=${movie.id}`
        })
        ct.querySelector('[data-caro-backdrop]').src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        carouselInner.append(ct)
    })
    carouselSection.classList.remove('d-none')
    carouselInner.firstElementChild.classList.add('active')
}
function renderDailyTrends(){
    const wrapper = document.querySelector('#scroll-menu .row')
    dailyTrends.forEach((movie) => {
        wrapper.innerHTML += `
        <div class="col">
            <div class="movie-card p-0" style="width: 210px;">
                <a href="/movie.html?id=${movie.id}">
                    <img class="movie-card-img img-fluid rounded mb-2" src="https://image.tmdb.org/t/p/original/${movie.poster_path}">
                </a>
                <div class="movie-card-header d-flex justify-content-between">
                    <h5>${movie.title}</h5>
                    <span class="fw-semibold">${(new Date(movie.release_date)).getUTCFullYear()}</span>
                </div>
                <div class="d-flex">
                    <div>
                        <i class="bi-star-fill text-warning"></i>
                        <span data-sm-vote-average>${(movie.vote_average).toFixed(1)}</span>
                    </div>
                    <div>
                        <span data-sm-votes class="ms-1">(${movie.vote_count})</span>
                    </div>
                </div>

            </div>
        </div>
        `
    })
}
// utility functions
function randomThree(array){
    // generate an array of three unique random numbers between 0 and array.length
    let randomNumbers = []
    while(randomNumbers.length < 3){
        let random = Math.round(Math.random() * (array.length - 1))
        if(!randomNumbers.includes(random)){
            randomNumbers.push(random)
        }
    }
    return randomNumbers
}

renderDailyTrends()
addCarouselContent()
