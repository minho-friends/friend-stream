"use client";

import { useState } from "react";

interface DebugTitleH1Props {
	chns: string | undefined;
	setChns: (chns: string | undefined) => void;
}

export default function DebugTitleH1({ chns, setChns }: DebugTitleH1Props) {
	const [debugCnt, setDebugCnt] = useState<number>(0);
	const [debugTimeout, setDebugTimeout] = useState<number | null>(null);
	const onDebug = () => {
		setDebugCnt((prev) => prev + 1);
		if (!debugTimeout) {
			setDebugTimeout(
				setTimeout(() => {
					setDebugCnt(0);
					setDebugTimeout(null);
				}, 3000),
			);
		}
		if (debugCnt === 5) {
			const override = prompt("Debug mode enabled", chns);
			if (!override) {
				setChns(undefined);
			} else {
				setChns(override);
			}
		}
	};

	return (
		<h1
			className="text-lg font-semibold"
			onClick={onDebug}
			onTouchStart={onDebug}
		>
			Live
		</h1>
	);
}
