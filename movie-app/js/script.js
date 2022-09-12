import Tmdb from "./tmdb.js"

const tmdb = new Tmdb
const dailyTrends = await tmdb.getMovieTrendingDaily()

function addCarouselContent(){

}
function renderDailyTrends(){
    const wrapper = document.querySelector('.daily-trends-wrapper')
    dailyTrends.results.forEach((movie) => {
        wrapper.innerHTML += `
        <div class="col">
            <div class="movie-card p-0" style="width: 210px;">
                <a href="/movie.html?id=${movie.id}">
                    <img class="movie-card-img rounded w-100 mb-2" src="https://image.tmdb.org/t/p/original/${movie.poster_path}">
                </a>
                <div class="movie-card-header d-flex justify-content-between">
                    <h5>${movie.title}</h5>
                    <span class="fw-semibold">${(new Date(movie.release_date)).getUTCFullYear()}</span>
                </div>
                <div class="d-flex justify-content-between">
                    <div>
                        <i class="bi-star-fill text-warning"></i>
                        <span data-sm-vote-average>${(movie.vote_average).toFixed(1)}</span>
                    </div>
                    <div>
                        <span data-sm-votes>(${movie.vote_count})</span>
                    </div>
                </div>

            </div>
        </div>
        `
    })
}
renderDailyTrends()
addCarouselContent()