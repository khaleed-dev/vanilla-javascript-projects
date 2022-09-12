import Tmdb from "./tmdb.js"

const moviesList = document.querySelector('.browse-movies-list')
const tmdb = new Tmdb
const url = new URL(window.location.href)
const URLQuery = url.searchParams.get("query")
const searchBtn = document.querySelector('.explore-search-btn')
let currentPage = 1

if(URLQuery != null){
    const querySearchResults =  await tmdb.search(URLQuery, currentPage)
    const totalPages = querySearchResults.total_pages
    document.querySelector('.total-pages').innerText = `: ${totalPages} Pages`
    showQuerySearchResults(querySearchResults.results)
    document.addEventListener('scroll', () => {
        infiniteScroll(totalPages)
    })
}else{
    moviesList.innerHTML = '<div>You can search for a movie in any language</div>'
}

searchBtn.addEventListener('click', () => {
    moviesList.innerHTML = ''
})

function infiniteScroll(totalPages){
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    const scrolled = window.scrollY
    if(Math.ceil(scrolled) === scrollable){
        if(currentPage < totalPages){
            currentPage++
            if(currentPage >= totalPages) return
            tmdb.search(URLQuery, currentPage).then((data) => {
                showQuerySearchResults(data.results)
            })
        }
    }
}
function showQuerySearchResults(results){
    results.forEach((result) => {
        let release_year = new Date(result.release_date)
        release_year = release_year.getUTCFullYear()
        let usedPoster;
        let apiPoster = `https://image.tmdb.org/t/p/w500/${result.poster_path}`
        let dummyPoster = "../images/poster-not-available.jpg"
        
        result.poster_path == null  ? usedPoster = dummyPoster : usedPoster = apiPoster

        moviesList.innerHTML += `
        <div class="movie-card me-3 mb-3" style="width: 210px;">
            <a href="../movie.html?id=${result.id}">
            <img class="movie-card-img rounded w-100 mb-2" src=${usedPoster}>
            </a>
            <div class="movie-card-header d-flex justify-content-between">
                <h5>${result.title}</h5>
                <small class="fw-semibold">${release_year}</small>
            </div>
            <div class="d-flex">
                <div class="me-1">
                    <i class="bi-star-fill text-warning"></i>
                    <span data-sm-vote-average>${(result.vote_average).toFixed(1)}</span>
                </div>
                <div>
                    <span data-sm-votes>(${result.vote_count})</span>
                </div>
            </div>
        </div>
        `
    })
}