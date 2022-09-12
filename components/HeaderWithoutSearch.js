import { useRouter } from "next/router";
import { ChevronLeft, ChevronRight } from "./Icons";

export default function HeaderWithoutSearch({ }) {
    const router = useRouter();
    return <div className="w-full py-6 px-10 relative z-10 bg-gradient-to-b from-black to-transparent">
        <div className="">
            <div className="flex items-center">
                <button onClick={() => router.back()} className="bg-neutral-800 hover:bg-neutral-700 rounded-full w-8 h-8 mr-4 flex items-center justify-center opacity-70 hover:opacity-100 transition duration-200">
                    <span className="fill-current text-white">
                        <ChevronLeft />
                    </span>
                </button>
            </div>
        </div>
    </div>
}