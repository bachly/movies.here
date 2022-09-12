import axios from 'axios';

export default async function GetMovieDetails(req, res) {
    const movieId = req.body.movieId;
    const query = encodeURIComponent(movieId);
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`;

    await axios.get(url)
        .then((response) => {
            res.status(200).json({
                data: {
                    ...response.data,
                    query
                }
            })
        })
        .catch((error) => {
            res.status(404).json({
                error
            })
        })
}