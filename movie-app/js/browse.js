import Tmdb from "./tmdb.js";
const tmdb = new Tmdb

const browseMoviesWrapper = document.querySelector('.browse-movies-list')
const UIPageCount = document.querySelector('.page-count')
const filtersWrapper = document.querySelector('.filters')
let currentPage = 1

//? initial render
checkState(window.location.hash)

//? Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    addFilterHTML()
})
document.addEventListener('click', (e) => {
    if(e.target.matches('[data-hash]')){
        const hash = `#${e.target.dataset.hash}`
        checkState(hash)
        // add class activated to selected button
        const buttons = document.querySelectorAll('[data-hash]')
        buttons.forEach((button) => {
            button.classList.remove('activated')
        })
        e.target.classList.add('activated')
    }
})
window.addEventListener('popstate', (e) => {
    const hash = checkHash()
    if(hash === '#best'){
        clearHtml()
        showBestMovies()
    }else if(hash === '#popular'){
        clearHtml()
        showPopularMovies()
    }else if(hash === '#now-playing'){
        clearHtml()
        showNowPlayingMovies()
    }
})
document.addEventListener('scroll', (e) => {
    infiniteScroll()
})
// adding filters to url
filtersWrapper.addEventListener('submit', (e) => {
    e.preventDefault()
    // get user filters
    const hash = checkHash()
    const year = e.target.querySelector('#year-filter').value
    const genre = e.target.querySelector('#genre-filter').value
    const language = e.target.querySelector('#language-filter').value

    // add filters to url
    let url = new URL(window.location.href)
    if(year != 0 && year != undefined && year != null){
        url.searchParams.set('year', year)
    }else{
        url.searchParams.delete('year')
    }
    if(genre != 0 && genre != undefined && genre != null){
        url.searchParams.set('genre', genre)
    }else{
        url.searchParams.delete('genre')
    }
    if(language != 0 && language != undefined && language != null){
        url.searchParams.set('language', language)
    }else{
        url.searchParams.delete('language')
    }
    // update url
    window.history.pushState({}, '', url)

    // show corresponding movies
    if(hash === '' || hash === '#now-playing'){
        clearHtml()
        showNowPlayingMovies({year: year, genre: genre, language: language})
    }else if(hash === '#popular'){
        clearHtml()
        showPopularMovies({year: year, genre: genre, language: language})
    }else if(hash === '#best'){
        clearHtml()
        showBestMovies({year: year, genre: genre, language: language})
    }else{
        return
    }
})

//?Functions
// state management
function checkState(hash){
    //? add hash to url / applying SPA logic
    let url = new URL(window.location.href)
    // remove filters from url
    url.searchParams.delete('year')
    url.searchParams.delete('genre')
    url.searchParams.delete('language')
    // update url
    window.history.pushState({}, '', url)
    // reset filters to selected
    resetFilters()
    switch(hash){
        case '#best':
            clearHtml()
            url = new URL(window.location.href)
            url.hash = 'best'
            history.pushState({}, '', `${url}`)
            showBestMovies()
            break;
        case '#popular':
            clearHtml()
            url = new URL(window.location.href)
            url.hash = 'popular'
            history.pushState({}, '', `${url}`)
            showPopularMovies()
            break;
        case '#now-playing':
            clearHtml()
            url = new URL(window.location.href)
            url.hash = 'now-playing'
            history.pushState({}, '', `${url}`)
            showNowPlayingMovies()
            break;
        default:
            showPopularMovies()
    }
}
// data source
async function showBestMovies({purpose = '', page = 1, year = '', genre = '', language = ''} = {}){
    const bestMovies = await tmdb.bestMovies({page: page, year: year, genre: genre, language: language})
    if(purpose === 'obj'){
        return bestMovies
    }else{
        renderResults(bestMovies)
    }
}
async function showPopularMovies({purpose = '', page = 1, year = '', genre = '', language = ''} = {}){
    const popularMovies = await tmdb.popularMovies({page: page, year: year, genre: genre, language: language})
    if(purpose === 'obj'){
        return popularMovies
    }else{
        renderResults(popularMovies)
    }
}
async function showNowPlayingMovies({purpose = '', page = 1, year = '', genre = '', language = ''} = {}){
    const nowPlaying = await tmdb.nowPlayingMovies({page: page, year: year, genre: genre, language: language})
    if(purpose === 'obj'){
        return nowPlaying
    }else{
        renderResults(nowPlaying)
    }
}
// infinite scroll
async function infiniteScroll(){
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    const scrolled = window.scrollY
    if(Math.ceil(scrolled) === scrollable){
        const hash = checkHash()
        const filters = getSearchParams()
        infiniteScrollLogic(hash, filters)
    }
}
async function infiniteScrollLogic(hash, filters){
    let totalPages;
    let res;
    if(hash === '#best'){
        res = await showBestMovies({page: currentPage, purpose: 'obj'})
        totalPages = res.total_pages
        if(currentPage < totalPages){
            currentPage ++
            if(currentPage >= totalPages) return
            showBestMovies({page: currentPage, year: filters.year, genre: filters.genre, language: filters.language})
        }
    }else if(hash === '#popular'){
        res = await showPopularMovies({page: currentPage, purpose: 'obj'})
        totalPages = res.total_pages
        if(currentPage < totalPages){
            currentPage ++
            if(currentPage >= totalPages) return
            showPopularMovies({page: currentPage, year: filters.year, genre: filters.genre, language: filters.language})
        }
    }else if(hash === '' || hash === '#now-playing'){
        res = await showNowPlayingMovies({page: currentPage, purpose: 'obj'})
        totalPages = res.total_pages
        if(currentPage < totalPages){
            currentPage ++
            if(currentPage >= totalPages) return
            showNowPlayingMovies({page: currentPage, year: filters.year, genre: filters.genre, language: filters.language})
        }
    }else{
        return
    }
}
// painting html
function renderResults(movies){
    UIPageCount.innerText = `: ${movies.total_pages} Pages`
    movies.results.forEach((movie) => {
        if(movie.poster_path == null) return
        browseMoviesWrapper.innerHTML += `
            <div class="me-3 mb-3" style="width: 210px;">
                <a href="/movie.html?id=${movie.id}">
                    <img class="rounded w-100 mb-2" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}">
                </a>
                <div class="d-flex justify-content-between">
                    <h5>${movie.title}</h5>
                    <span class="fw-semibold">${(new Date(movie.release_date)).getUTCFullYear()}</span>
                </div>
                <div class="d-flex">
                    <div class="me-1">
                        <i class="bi-star-fill text-warning"></i>
                        <span data-sm-vote-average>${(movie.vote_average).toFixed(1)}</span>
                    </div>
                    <div>
                        <span data-sm-votes>(${movie.vote_count})</span>
                    </div>
                </div>
            </div>
        `
    })
}
async function addFilterHTML() {
    let years = document.getElementById("year-filter");
    let currentYear = (new Date()).getFullYear();
    let yearsArray = [];
    // add 90s, 80s, 70s to the end of yearsArray
    // how to object stringify and parse

    yearsArray.push(new Option("1960s", JSON.stringify({start: 1960, end: 1969})))
    yearsArray.push(new Option("1970s", JSON.stringify({start: 1970, end: 1979})))
    yearsArray.push(new Option("1980s",  JSON.stringify({start: 1980, end: 1989})));
    yearsArray.push(new Option("1990s", JSON.stringify({start: 1990, end: 1999})));
    for (let i = 2000; i <= currentYear; i++) {
        let option = document.createElement("OPTION");
        option.innerHTML = i;
        option.value = i;
        yearsArray.push(option);
    }
    yearsArray.reverse().forEach((option) => {
        years.appendChild(option);
    });
    let languages = document.getElementById("language-filter");
    const response = await fetch('https://api.themoviedb.org/3/configuration/languages?api_key=9f5501a00237a4b5dd7393359c9d77b1')
    const data = await response.json()
    data.forEach((language) => {
        let option = document.createElement("OPTION");
        option.innerHTML = language.english_name;
        option.value = language.iso_639_1;
        languages.appendChild(option);
    });
};
// helpers
function getSearchParams(){
    const url = new URL(window.location.href)
    let params = {}
    const year = url.searchParams.get('year')
    const genre = url.searchParams.get('genre')
    const language = url.searchParams.get('language')
    if(year != null){
        params.year = year
    }
    if(genre != null){
        params.genre = genre
    }
    if(language != null){
        params.language = language
    }
    return params
}
function checkHash(){
    let url = new URL(window.location.href)
    const hash = url.hash
    return hash
}
function clearHtml(){
    browseMoviesWrapper.innerHTML = ''
}
function resetFilters(){
    const filters = document.querySelectorAll('.filter')
    filters.forEach((filter) => {filter.selectedIndex = 0})   
}