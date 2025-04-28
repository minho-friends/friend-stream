import { WifiOff } from "lucide-react";

interface EmptyStateViewProps {
	message: string;
}

export default function EmptyStateView({ message }: EmptyStateViewProps) {
	const onRefresh = () => {
		window.location.reload();
	};
	return (
		<div className="h-full flex flex-col">
			{/* iOS-style header */}
			<div className="sticky top-0 z-10 bg-black flex items-center justify-between px-4 py-3 border-b border-gray-800">
				<h1 className="text-lg font-semibold">Videos</h1>
			</div>

			{/* Empty state content */}
			<div className="flex-1 flex flex-col items-center justify-center px-6">
				<div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-6">
					<WifiOff size={40} className="text-gray-400" />
				</div>

				<h2 className="text-xl font-medium text-white mb-2">{message}</h2>
				<p className="text-gray-400 text-center mb-8">
					There was a problem loading videos. Check your connection and try
					again.
				</p>

				<button
					onClick={onRefresh}
					className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-full flex items-center justify-center min-w-[180px] transition-colors"
				>
					Try Again
				</button>
			</div>

			{/* iOS-style bottom safe area */}
			<div className="h-6 bg-black" />
		</div>
	);
}
