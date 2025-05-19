"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import VideoPlaylist from "./components/video-playlist.tsx";
import EmptyStateView from "./components/empty-state-view.tsx";

const url = (chns?: string) => {
	const _ = import.meta.env.DEV
		? "http://localhost:8787/api/streams"
		: "/api/streams";
	if (chns) return `${_}?chns=${chns}`;
	return _;
};

export default function Home() {
	const [chns, setChns] = useState<string | undefined>(undefined);
	const [isAndroid, setIsAndroid] = useState<boolean>(false);

	useEffect(() => {
		if (/Android/i.test(navigator.userAgent)) {
			setIsAndroid(true);
		}
	}, []);

	const {
		data: videos = [],
		error,
		mutate,
	} = useSWR(
		url(chns),
		(url: string) =>
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
			<VideoPlaylist
				videos={videos}
				updateVideos={mutate}
				chns={chns}
				setChns={setChns}
				isAndroid={isAndroid}
			/>
		</main>
	);
}
