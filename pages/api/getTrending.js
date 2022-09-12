import axios from 'axios';

export default async function GetTrending(req, res) {
    const mediaType = req.body.mediaType || 'movie'; 
    const timeWindow = req.body.timeWindow || 'week';
    const url = `https://api.themoviedb.org/3/trending/${mediaType}/${timeWindow}?api_key=${process.env.TMDB_API_KEY}`;

    await axios.get(url)
        .then((response) => {
            res.status(200).json({
                data: {
                    ...response.data,
                }
            })
        })
        .catch((error) => {
            res.status(404).json({
                error
            })
        })
}