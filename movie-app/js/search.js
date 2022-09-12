import Tmdb from "./tmdb.js"
const WEBSITE = "http://127.0.0.1:5500"

//? selectors
const UISearchInput = document.querySelector('#search-input')
const UISearchResultsWrapper = document.querySelector('#search-results')
const UISearchLis = document.querySelector('[data-search-lis]')
const offcanvas = document.querySelector('.offcanvas')

//? api instances
const tmdb = new Tmdb
const weeklyTrends = await tmdb.getMovieTrendingWeekly()
//? Event Listners
document.addEventListener('click', (e) => {
    // Show search trends on search input click, Hide when clicked away
    if(e.target.matches('#search-input') && UISearchInput.value === ''){
        showSearchTrends()
        UIShowSearchResults()
    }
    if(e.target.matches('#search-input') && UISearchInput.value !== ''){
        UIShowSearchResults()
    }
    if(!offcanvas.classList.contains('show')){
        UIHideSearchResults()
    }
})
UISearchInput.addEventListener('keyup', (e) => {
    //hide search trends while typing and show query results suggestions
    hideSearchTrends()
    const searchQuery = UISearchInput.value
    if(searchQuery !== '') showSearchRecommendations(searchQuery)
    if(e.key === 'Enter'){
        window.location.href = `${WEBSITE}/explore.html?query=${searchQuery}`
    }else if(e.key === 'Escape'){
        UISearchInput.value = ''
        UIHideSearchResults()
    }
})
//? functions

async function showSearchRecommendations(query){
    UISearchLis.innerHTML = ''
    const searchResults = await tmdb.search(query)
    let count = 0
    searchResults.results.forEach((result) => {
        //get release date
        let release_year = (result.release_date).split('-')[0]
        if(count > 9) return
        UISearchLis.innerHTML += 
        `
        <a class="list-group-item list-group-item-action d-flex justify-content-between" href="http://127.0.0.1:5500/explore.html?query=${result.title}"><div>${result.title} <small class="text-muted ">(${release_year})</small></div><small class="fs-6 text-muted">${result.original_title}</small></a>`
        count ++
    })
}
function showSearchTrends(){
    UISearchLis.innerHTML = `<li class="list-group-item trending-item xz"><img src="../images/trend.png" style="width: 20px; margin-right: 10px;"> Trending</li>`

    weeklyTrends.forEach((result) => {
        if(result.title == undefined){
            UISearchLis.innerHTML += `
            <a class="list-group-item list-group-item-action search-trends" href="http://127.0.0.1:5500/explore.html?query=${result.name}">${result.name}</a>
            `
        }else{
            UISearchLis.innerHTML += `
            <a class="list-group-item list-group-item-action search-trends" href="http://127.0.0.1:5500/explore.html?query=${result.title}">${result.title}</a>
            `
        }
    })
}
function hideSearchTrends(){
    if(document.querySelector('.trending-item') != null){
        UISearchLis.innerHTML = ''
    }
}
//? utility functions
function UIShowSearchResults(){
    UISearchResultsWrapper.classList.remove('hide')
    offcanvas.classList.remove('offcanvas-5')
    offcanvas.classList.add('offcanvas-35')
}
function UIHideSearchResults(){
    UISearchResultsWrapper.classList.add('hide')
    UISearchLis.innerHTML = ''
    offcanvas.classList.add('offcanvas-5')
    offcanvas.classList.remove('offcanvas-35')
    UISearchInput.value = ''
}

/*
todo
    * make search work
        // show the search results tab on search form click
        // show most popular searchs of the day as default
        // hide search on click away
        // hide search trends on typing
        // show search recommended results while user is typing
        // on enter or select from most likely or trends redirect to explore.html page with the search query value

    * 
*/