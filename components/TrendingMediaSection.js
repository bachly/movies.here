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
                    return <section className="mb-20">
                        <div className="text-base lg:text-2xl text-neutral-300 font-semibold">{title}</div>
                        <div className="mt-4">
                            <Splide options={{
                                gap: '1rem',
                                perPage: 5,
                                arrows: false,
                                breakpoints: {
                                    1280: {
                                        perPage: 2,
                                    },
                                    640: {
                                        gap: '0.5rem',
                                        perPage: 2,
                                    },
                                }
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
                return <section className="mb-20">
                    <div className="text-base lg:text-2xl w-64 bg-neutral-800 bg-opacity-40">&nbsp;</div>
                    <div className="mt-4 grid grid-cols-2 xl:grid-cols-5 gap-2 lg:gap-4 place-items-start">
                        {new Array(5).fill('1').map((item, index) => <MovieThumbnailSkeleton
                            key={`movie-thumbnail-skeleton-${index}`} />)}
                    </div>
                </section>
            }
        })()}
    </>
}