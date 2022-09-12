import Tmdb from "./tmdb.js";
import formatCurrency from "./util/formatCurrency.js";
import separateComma from "./util/formatNumber.js";

const UIMovieDetailsTemplate = document.querySelector('.movie-details-template')
const UIMovieDetailsContainer = document.getElementById('movie-details')
const UIMovieCastTemplate = document.querySelector('.movie-cast-template')
const UICastContainer = document.querySelector('.cast-container')
const UISimilarMoviesTemplate = document.querySelector('.similar-movies-template')
const UISimilarMOviesContainer = document.querySelector('.similar-movies')
const UITrailer = document.querySelector('iframe')
const UITrailerViews = document.querySelector('.views-count')


const GOOGLE_KEY = 'AIzaSyBtqDm6AQZ9GF0qbY-WKqMEC2ccLzjnMv4'
const tmdb = new Tmdb
const url = new URL(window.location.href)
const movieID = url.searchParams.get('id')
const movieDetails = await tmdb.getMovieDetails(movieID)
const movieCredits = await tmdb.getCredits(movieID)
const similarMovies = await tmdb.getSimilar(movieID)

console.log(movieDetails)

const trailerInfo = showMovieTrailer()
if(trailerInfo != undefined){
    const trailerKey = trailerInfo.key
    let trailerViews = await getTrailerViews(GOOGLE_KEY, trailerKey)
    if(trailerViews.items[0] != undefined){
        trailerViews = separateComma(trailerViews.items[0].statistics.viewCount)
    }else{
        trailerViews = "?"
    }
    UITrailerViews.innerText = `${trailerViews} Youtube Views`
    UITrailer.src = `https://www.youtube.com/embed/${trailerKey}`
}else{
    UITrailer.closest('#movie-trailer').remove()
}


function getCrew(arr){
    //? this function sorts by crew members popularity, removes duplicate names and getting one of each crew department
    let result = arr.sort((a, b) => {
        return b.popularity - a.popularity
    }).filter((value, index, self) => self.findIndex((m) => m.name === value.name) === index).filter((value, index, self) => self.findIndex((m) => m.department === value.department) === index)
    return result
}
function renderMovieDetails(){
    const MD = UIMovieDetailsTemplate.content.cloneNode(true)
    
    const banner = MD.querySelector('[data-movie-banner]')
    if(movieDetails.backdrop_path == null){
        banner.src = "../images/aflamDB-banner.jpg"
    }else{
        banner.src = `https://image.tmdb.org/t/p/original/${movieDetails.backdrop_path}`
    }
    
    const poster = MD.querySelector('[data-movie-poster]')
    poster.src = `https://image.tmdb.org/t/p/original/${movieDetails.poster_path}`

    const year = MD.querySelector('[data-movie-year]')
    const releaseDate = new Date(movieDetails.release_date).getUTCFullYear()
    year.innerText = `(${releaseDate})`

    const OGMovieName = MD.querySelector('[data-movie-original-name]')
    OGMovieName.innerText = movieDetails.original_title
    
    const ogLanguage = movieDetails.original_language
    const watchEgybest = MD.querySelector('.watch-egybest')
    const watchDopeBox = MD.querySelector('.watch-dopebox')

    if(ogLanguage === 'ar'){
        let query = movieDetails.original_title.replace(/\s/g, '-')
        watchEgybest.href = `https://gear.egybest.asia/explore/?q=${query}`
        watchDopeBox.remove()
    }else{
        let query = movieDetails.title.replace(/\s/g, '-')
        watchEgybest.href = `https://gear.egybest.asia/explore/?q=${query}-${releaseDate}`
        watchDopeBox.href = `https://dopebox.to/search/${query}`
    }


    const UIGenres = MD.querySelector('[data-movie-genres]')
    const genres = movieDetails.genres
    genres.forEach((genre) => {
        UIGenres.innerHTML += `<span class="badge text-bg-light me-2">${genre.name}</span>`
    })

    const rating = MD.querySelector('[data-movie-rating]')
    rating.innerHTML = `TMDB Rating: <i class="bi bi-star-fill text-warning"></i> ${(movieDetails.vote_average).toFixed(1)}`

    const ratingCount = MD.querySelector('[data-movie-rating-count]')
    ratingCount.innerText = `(${movieDetails.vote_count})`

    const overview = MD.querySelector('[data-movie-overview]')
    overview.innerText = movieDetails.overview

    const movieName = MD.querySelector('[data-movie-name]')
    movieName.innerText = movieDetails.title

    const budget = MD.querySelector('[data-movie-budget]')
    budget.innerText = formatCurrency(movieDetails.budget)

    const revenue = MD.querySelector('[data-movie-revenue]')
    revenue.innerText = formatCurrency(movieDetails.revenue)

    const crew = getCrew(movieCredits.crew)
    const UIExtraMovieDetails = MD.querySelector('.extra-movie-details')
    crew.forEach((member)=>{
        UIExtraMovieDetails.innerHTML += `
        <div>${member.department}: <span>${member.name}</span></div>
        `
    })
    UIMovieDetailsContainer.append(MD)
}
function renderMovieCast(){
    const cast = (movieCredits.cast).slice(0, 15)

    cast.forEach((actor) => {
        if(actor.profile_path == null){
            return;
        }
        const MC = UIMovieCastTemplate.content.cloneNode(true)
        const img = MC.querySelector('.actor-img')
        const name = MC.querySelector('.actor-name')
        const characterName = MC.querySelector('.character-name')
        img.src = `https://image.tmdb.org/t/p/w500/${actor.profile_path}`
        name.innerText = actor.name
        characterName.innerText = actor.character
        UICastContainer.append(MC)

    })
}
function renderSimilarMovies(movies){
    movies.results.forEach((movie) => {
        if(movie.poster_path == null){
            return;
        }
        const SM = UISimilarMoviesTemplate.content.cloneNode(true)
        // href="/movie.html?id=${result.id}"
        const movieLink = SM.querySelector('[data-sm-link]')
        movieLink.href =  `../movie.html?id=${movie.id}`

        const movieImg = SM.querySelector('[data-sm-img]')
        movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`

        const movieTitle = SM.querySelector('[data-sm-title]')
        movieTitle.innerText = movie.title

        const movieYear = SM.querySelector('[data-sm-year]')
        movieYear.innerText = (new Date(movie.release_date)).getUTCFullYear()

        const voteAverage = SM.querySelector('[data-sm-vote-average]')
        voteAverage.innerText = movie.vote_average.toFixed(1)

        const voteCount = SM.querySelector('[data-sm-votes]')
        voteCount.innerHTML = `(${movie.vote_count})`

        UISimilarMOviesContainer.append(SM)
    })
}
function showMovieTrailer(){
    let re = /official trailer/gi
    let trailer = movieDetails.videos.results
    trailer = trailer.find((result) => {
        if(re.test(result.name) || result.type === "Trailer"){
            return true
        }
        return false
    })

    if(trailer != undefined){
        return trailer
    }
}
async function getTrailerViews(key, id){
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${id}&key=${key}`)
    const data = await response.json()
    return data
}

renderMovieDetails()
showMovieTrailer()
renderMovieCast()
setTimeout(() => {
    renderSimilarMovies(similarMovies)
}, 2000);



/*
? Movie Details to get:
section 1:
    - backdrop ✔️ ✔️
    - poster ✔️ ✔️
    - release year ✔️ ✔️
    - name ✔️✔️
    - genres ✔️✔️
    - rating & rating count ✔️✔️
    - overview ✔️✔️
    - budget, revenue ✔️✔️
    - director, producer, writer ✔️✔️
    - watch now (egybest, watch on: appletv, netflix ...) ❌
section 2:
    - youtube trailer ✔️✔️
section 3:
    - top billed cast ✔️✔️
        picture
        name
        character name
section 4:
    - similar movies ✔️✔️
        poster
        name
        release year
        rating & rating count
*/
