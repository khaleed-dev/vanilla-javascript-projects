export default class Tmdb{
    constructor(){
        this.key = '9f5501a00237a4b5dd7393359c9d77b1'
    }
    async getLanguages(){
        const response = await fetch(`https://api.themoviedb.org/3/configuration/languages?api_key=${this.key}`)
        const data = await response.json()
        return data
    }
    async getMovieTrendingDaily(){
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${this.key}&page=1`)
        const data = await response.json()
        return data
    }
    async getMovieTrendingWeekly(){
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${this.key}&page=1`)
        const data = await response.json()
        const modifiedData = data.results.slice(0, -10)
        return modifiedData
    }
    async search(query, page){
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${this.key}&query=${query}&page=${page}&include_adult=false`)
        const data = await response.json()
        // const modifiedData = data.results
        return data
    }
    async getMovieDetails(id){
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${this.key}&append_to_response=videos,watch/providers`)
        const data = await response.json()
        return data
    }
    async getCredits(id){
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${this.key}`)
        const data = await response.json()
        return data
    }
    async getSimilar(id){
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${this.key}&include_adult=false&page=1`)
        const data = await response.json()
        return data
    }

    // es6 default named parameters with object destructuring
    // for page, year, genre, language

    async bestMovies({page = 1, year = '', genre = '', language = ''}={}){
        language == null ? language = '' : language
        let re = /^{/g
        if(re.test(year)){
            const yearObj = JSON.parse(year)
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${this.key}&sort_by=vote_count.desc&include_adult=false&include_video=false&language=en-US&page=${page}&primary_release_year=${year}&with_genres=${genre}&with_original_language=${language}&primary_release_date.gte=${yearObj.start}&primary_release_date.lte=${yearObj.end}`)
            const data = await response.json()
            return data
        }else{
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${this.key}&sort_by=vote_count.desc&include_adult=false&include_video=false&language=en-US&page=${page}&primary_release_year=${year}&with_genres=${genre}&with_original_language=${language}`)
            const data = await response.json()
            return data
        }
    }
    async popularMovies({page = 1, year = '', genre = '', language = ''}={}){
        language == null ? language = '' : language
        let re = /^{/g
        if(re.test(year)){
            const yearObj = JSON.parse(year)
            const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${this.key}&include_adult=false&include_video=false&language=en-US&page=${page}&primary_release_year=${year}&with_genres=${genre}&with_original_language=${language}&primary_release_date.gte=${yearObj.start}&primary_release_date.lte=${yearObj.end}`)
            const data = await response.json()
            return data
        }else{
            const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${this.key}&include_adult=false&include_video=false&language=en-US&page=${page}&primary_release_year=${year}&with_genres=${genre}&with_original_language=${language}`)
            const data = await response.json()
            return data
        }
        
    }
    async nowPlayingMovies({page = 1, year = '', genre = '', language = ''}={}){
        language == null ? language = '' : language
        let re = /^{/g
        if(re.test(year)){
            const yearObj = JSON.parse(year)
            const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${this.key}&include_adult=false&include_video=false&language=en-US&page=${page}&primary_release_year=${year}&with_genres=${genre}&with_original_language=${language}&primary_release_date.gte=${yearObj.start}&primary_release_date.lte=${yearObj.end}`)
            const data = await response.json()
            return data
        }else{
            const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${this.key}&include_adult=false&include_video=false&language=en-US&page=${page}&primary_release_year=${year}&with_genres=${genre}&with_original_language=${language}`)
            const data = await response.json()
            return data
        }
        
    }
}


/*

Allowed Values: , popularity.asc, popularity.desc, release_date.asc, release_date.desc, revenue.asc, revenue.desc, primary_release_date.asc, primary_release_date.desc, original_title.asc, original_title.desc, vote_average.asc, vote_average.desc, vote_count.asc, vote_count.desc
default: popularity.desc

*/