"use client";

import useSWR from "swr";
import VideoPlaylist from "./components/video-playlist.tsx";
import EmptyStateView from "./components/empty-state-view.tsx";

export default function Home() {
	const {
		data: videos = [],
		error,
		mutate,
	} = useSWR(
		"/api/streams",
		(url) =>
			fetch(url).then((res) => {
				if (!res.ok) {
					throw new Error("Network response was not ok");
				}
				return res.json();
			}),
		{
			shouldRetryOnError: false,
			revalidateOnFocus: true,
			revalidateOnReconnect: true,
			refreshInterval: 10000,
		},
	);
	if (error) {
		return (
			<main className="h-screen bg-black text-white overflow-hidden">
				<EmptyStateView message={"VPN+Cert Required!"} />
			</main>
		);
	}
	return (
		<main className="h-screen bg-black text-white overflow-hidden">
			<VideoPlaylist videos={videos} updateVideos={mutate} />
		</main>
	);
}
