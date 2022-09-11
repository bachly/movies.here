import axios from 'axios';

export default async function SearchMovies(req, res) {
    const searchTerm = req.body.searchTerm;
    const page = req.body.page || 1;
    const query = encodeURIComponent(searchTerm);
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${query}&page=${page}`;

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