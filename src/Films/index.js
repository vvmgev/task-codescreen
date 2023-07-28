import React, { Component, createRef } from 'react';
import './style.css';
import axios from 'axios';

const filmsEndpointURL = "https://app.codescreen.com/api/assessments/films";
const apiToken = "8c5996d5-fb89-46c9-8821-7063cfbc18b1"

axios.defaults.headers.common['Authorization'] = apiToken;

//Your API token. This is needed to successfully authenticate when calling the films endpoint. 
//This needs to be added to the Authorization header (using the Bearer authentication scheme) in the request you send to the films endpoint.

export default class Films extends Component {
  state = {films: []};
  inputRef = createRef();


  /**
    * Retrieves the name of the best rated film from the given list of films.
    * If the given list of films is empty, this method should return "N/A".
  */
  getBestRatedFilm(films) {
    if(!films.length) return 'N/A';
    return films.reduce((prev, current) => (prev.rating < current.rating  ? current : prev)).name;
  }

  /**
    * Retrieves the length of the film which has the longest running time from the given list of films.
    * If the given list of films is empty, this method should return "N/A".
    * 
    * The return value from this function should be in the form "{length} mins"
    * For example, if the duration of the longest film is 120, this function should return "120 mins".
  */
  getLongestFilm(films) {
    if(!films.length) return 'N/A';
    const time = films.reduce((prev, current) => (prev < current.length  ? current.length : prev), 0);
    return `${time} mins`;
  }

  /**
    * Retrieves the average rating for the films from the given list of films, rounded to 1 decimal place.
    * If the given list of films is empty, this method should return 0.
  */
  getAverageRating(films) {
    if(!films.length) return 0;
    const ratingSum = films.reduce((prev, current) => (prev + current.rating), 0);
    return (ratingSum / films.length).toFixed(1);
  }

  /**
    * Retrieves the shortest number of days between any two film releases from the given list of films.
    * 
    * If the given list of films is empty, this method should return "N/A".
    * If the given list contains only one film, this method should return 0.
    * Note that no director released more than one film on any given day.
    * 
    * For example, if the given list is composed of the following 3 entries
    *
    * {
    *    "name": "Batman Begins",
    *    "length": 140,
    *
    *    "rating": 8.2,
    *    "releaseDate": "2006-06-16",
    *    "directorName": "Christopher Nolan"
    * },
    * {
    *    "name": "Interstellar",
    *    "length": 169,
    *    "rating": 8.6,
    *    "releaseDate": "2014-11-07",
    *    "directorName": "Christopher Nolan"
    * },
    * {
    *   "name": "Prestige",
    *   "length": 130,
    *   "rating": 8.5,
    *   "releaseDate": "2006-11-10",
    *   "directorName": "Christopher Nolan"
    * }
    *
    * then this method should return 147, as Prestige was released 147 days after Batman Begins.
  */
  getShortestNumberOfDaysBetweenFilmReleases(films) {
    if(!films.length) return 'N/A';
    if(films.length === 1) return 0;
    const sortedFilms = films.sort((a, b) => new Date(a.releaseDate).getTime() > new Date(b.releaseDate).getTime() ? 1 : -1);
    let days = Infinity;
    for(let i = 0; i < sortedFilms.length; i++) {
      const currentItem = sortedFilms[i];
      const nextItem = sortedFilms[i + 1];
      if(!nextItem) return days;
      const diff = new Date(nextItem.releaseDate).getTime() - new Date(currentItem.releaseDate).getTime();
      if(days > (diff / (1000 * 3600 * 24))) {
        days = diff / (1000 * 3600 * 24);
      }
    }
    return days;
  }

  getFilms = async (e) => {
    e.preventDefault();
    const inputValue = this.inputRef.current.value;
    const url = filmsEndpointURL;
    const { data: films } = await axios.get(url, { params: {
      directorName: inputValue,
    }});
    console.log('films', films);
    this.setState({films});
  }

  render() {
    const { films } = this.state;
    return <div className="content">
      <form id="input-form" onSubmit={this.getFilms}>
        <div><input ref={this.inputRef} className="input-field" id="input-box" /></div>
        <button className="submitBtn">Sumbit</button>
      </form>
      <div className='film-content'>
        <div className="film-box">
          <div className="film-title">Best rated file</div>
          <div id="best-rated-film">{this.getBestRatedFilm(films)}</div>
        </div>
        <div className="film-box">
          <div className="film-title">Lonagest file duration</div>
          <div id="longest-film">{this.getLongestFilm(films)}</div>
        </div>
      </div>
      <div className='film-content'>
      <div className="film-box">
          <div className="film-title">Average rating</div>
          <div className="average-rating" id="average-rating">{this.getAverageRating(films)}</div>
        </div>
        <div className="film-box">
          <div className="film-title">shortest days between releases</div>
          <div className="shortest-days" id="shortest-days">{this.getShortestNumberOfDaysBetweenFilmReleases(films)}</div>
        </div>
      </div>
    </div>
  }

  componentDidMount() {

  }

}
