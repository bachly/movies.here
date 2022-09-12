import useAxios from "axios-hooks"
import { useContext, useEffect } from "react"
import { AppContext } from "../lib/reactContexts";
import { MovieThumbnail, MovieThumbnailSkeleton } from "./MovieThumbnail"
import _ from "underscore";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { TvShowThumbnail } from "./TvShowThumbnail";

export default function TrendinMediaSection({ mediaType = 'movie', timeWindow = 'week', title }) {
    const { appState, dispatchAppAction } = useContext(AppContext);
    const mediaGroup = `${mediaType}_${timeWindow}`;

    const [{ data: successGettingTrendingMedia }
    ] = useAxios(
        {
            url: '/api/getTrending',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            data: JSON.stringify({
                mediaType,
                timeWindow
            })
        },
        { manual: false }
    )

    useEffect(function onSuccessGettingTrendingMedia() {
        if (successGettingTrendingMedia) {
            console.log('onSuccessGettingTrendingMedia', successGettingTrendingMedia.data.results)
            dispatchAppAction({
                type: "setTrendingMedia",
                payload: {
                    mediaGroup,
                    items: successGettingTrendingMedia.data.results || []
                }
            })
        }
    }, [successGettingTrendingMedia])

    return <>
        {(() => {
            if (appState.trendingMedia && appState.trendingMedia[mediaGroup]) {
                if (appState.trendingMedia[mediaGroup].length === 0) {
                    return <></>
                } else {
                    return <section className="mb-8 pb-8">
                        <div className="text-3xl text-white font-bold">{title}</div>
                        <div className="mt-6">
                            <Splide options={{
                                gap: '1rem',
                                perPage: 5,
                                pagination: false
                            }}>
                                {_.first(appState.trendingMedia[mediaGroup], 10).map(media =>
                                    <SplideSlide key={media.id}>
                                        {(() => {
                                            switch (mediaType) {
                                                case "movie":
                                                    return <MovieThumbnail key={media.id} movie={media} />
                                                case "tv":
                                                    return <TvShowThumbnail key={media.id} show={media} />
                                                default:
                                                    return <></>
                                            }
                                        })()}
                                    </SplideSlide>)}
                            </Splide>
                        </div>
                    </section>
                }
            } else {
                return <section className="mb-8">
                    <div className="text-3xl w-64 bg-neutral-800">&nbsp;</div>
                    <div className="mt-6 grid grid-cols-5 gap-4 place-items-start">
                        {new Array(5).fill('1').map((item, index) => <MovieThumbnailSkeleton
                            key={`movie-thumbnail-skeleton-${index}`} />)}
                    </div>
                </section>
            }
        })()}
    </>
}