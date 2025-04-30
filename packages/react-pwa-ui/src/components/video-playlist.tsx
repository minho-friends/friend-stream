"use client";

import { useState } from "react";
import { Camera, CameraOff, RefreshCw, MoreVertical } from "lucide-react";
import { formatRelativeTime } from "../utils/date-formatter";

interface Video {
	id: number;
	isStream: boolean;
	title: string;
	thumbnail: string;
	streamUrl: string;
	streamStartDate?: string;
	lastStreamDate: string;
}

interface VideoPlaylistProps {
	videos: Video[];
	updateVideos: () => void;
}

export default function VideoPlaylist({
	videos,
	updateVideos,
}: VideoPlaylistProps) {
	const [refreshing, setRefreshing] = useState(false);
	const [videoOn, setVideoOn] = useState(true);
	const [lastRefresh, setLastRefresh] = useState(Date.now());
	const onRefresh = () => {
		updateVideos();
		setRefreshing(true);
		setLastRefresh(Date.now());

		setTimeout(() => {
			setRefreshing(false);
		}, 1500);
	};

	const handleVideoClick = (videoId: number) => {
		const video = videos.find((v) => v.id === videoId);
		if (video?.streamUrl) {
			if (videoOn) {
				window.open(video.streamUrl, "_blank");
			} else {
				window.open(`${video.streamUrl}?audio=1`, "_blank");
			}
		}
	};

	return (
		<div className="flex flex-col h-full">
			{/* iOS-style header */}
			<div className="sticky top-0 z-10 bg-black flex items-center justify-between px-4 py-3 border-b border-gray-800">
				<h1 className="text-lg font-semibold">Live</h1>
				<div className="flex items-center gap-2">
					{videoOn ? (
						<button
							onClick={() => setVideoOn(false)}
							className="rounded-full w-8 h-8 flex items-center justify-center active:bg-gray-800 transition-colors"
							aria-label="Refresh"
						>
							<Camera size={18} className={`text-green-300`} />
						</button>
					) : (
						<button
							onClick={() => setVideoOn(true)}
							className="rounded-full w-8 h-8 flex items-center justify-center active:bg-gray-800 transition-colors"
							aria-label="Refresh"
						>
							<CameraOff size={18} className={`text-red-300`} />
						</button>
					)}
					<button
						onClick={onRefresh}
						disabled={refreshing}
						className="rounded-full w-8 h-8 flex items-center justify-center active:bg-gray-800 transition-colors"
						aria-label="Refresh"
					>
						<RefreshCw
							size={18}
							className={`text-white ${refreshing ? "animate-spin" : ""}`}
						/>
					</button>
				</div>
			</div>

			{/* Video list */}
			<div className="flex-1 overflow-y-auto pb-safe">
				{videos
					// .filter((video) => video.isStream)
					.map((video) => (
						<div key={`${video.id}`} className="border-b border-gray-800">
							<div className="p-4" onClick={() => handleVideoClick(video.id)}>
								<div className="relative aspect-video rounded-lg overflow-hidden mb-3">
									<div className="w-full h-full relative">
										{refreshing ? (
											<div className="absolute inset-0 bg-gray-800 animate-pulse z-10"></div>
										) : null}
										<img
											src={
												video.thumbnail
													? `${video.thumbnail}?refresh=${lastRefresh}`
													: "/offline.webp"
											}
											alt={video.title}
											className={`w-full object-cover ${refreshing ? "opacity-50" : "opacity-100"} transition-opacity duration-500 ${videoOn ? "grayscale-0" : "grayscale"}`}
											key={`${video.id}-${refreshing ? "refreshing" : "idle"}`}
										/>
									</div>
								</div>

								{/* Video info */}
								<div className="flex gap-3">
									<div className="flex-1">
										<h3 className="font-medium text-sm mb-1 line-clamp-2">
											{video.title}
										</h3>
										<p className="text-xs text-gray-400">
											{formatRelativeTime(
												video.streamStartDate || video.lastStreamDate,
											)}
											{video.streamStartDate ? " - Live" : ""}
										</p>
									</div>
									<button
										className="text-gray-400 self-start p-1"
										aria-label="More options"
									>
										<MoreVertical size={16} />
									</button>
								</div>
							</div>
						</div>
					))}
			</div>

			{/* iOS-style bottom safe area */}
			<div className="h-8 bg-black" />
		</div>
	);
}
