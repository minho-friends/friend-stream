import { Hono } from "hono";
import { proxy as fetch } from "hono/proxy";
import { cors } from "hono/cors";

type Bindings = {
	cookie_domain: string;
	api_stream_info: string;
	stream_prefix: string;
	chns: string;
};

const app = new Hono<{ Bindings: Bindings }>();
app.use(cors());

const _client_id = async (cookie_domain: string) => {
	const _ = await fetch(cookie_domain);
	const _cookies = _.headers.get("set-cookie");
	const _cookie = _cookies
		?.split(";")
		.find((__: any) => __.startsWith("client-id"));
	const gotcha = _cookie?.split("=")[1];
	return gotcha;
};

const _stream = async (
	client_id: string,
	api_stream_info: string,
	id: string,
) => {
	if (!id) return;
	const response = await fetch(`${api_stream_info}/${id}`, {
		headers: {
			Accept: "application/json",
			"User-Agent": "",
			authorization: "Bearer undefined",
			"client-id": client_id,
			lang: "en-US",
			"region-code": "GLOBAL",
		},
	});
	if (!response.ok) return;
	const data = await response.json();
	const isStream = data.data.isStream;
	const streamUrl = isStream ? `/live/${id}/master.m3u8` : "";
	const output = {
		isStream,
		streamUrl,
		lastStreamDate: data.data.lastStreamDate,
		streamStartDate: data.data.streamStartDate,
		title: data.data.title,
		thumbnail: data.data.thumbnailUrl,
	};
	return output;
};

app.get("/api/streams", async (c) => {
	const client_id = await _client_id(c.env.cookie_domain);
	const chns = (c.req.query("chns") || c.env.chns).split(",");
	const streams = await Promise.all(
		chns.map((chn) => _stream(client_id, c.env.api_stream_info, chn)),
	).then((data) =>
		data.filter((item) => !!item).map((item, idx) => ({ ...item, id: idx })),
	);
	return c.json(streams);
});

const m3u8Proxy = async (prefix: string, url: string) => {
	const response = await fetch(url, {
		headers: {
			Accept: "application/x-mpegURL",
			Referer: prefix,
			"User-Agent": "",
		},
	});
	const text = await response.text();
	return text;
};

app.get("/live/:id/master.m3u8", async (c) => {
	const id = c.req.param("id");
	const prefix = c.env.stream_prefix;
	const isAudioOnly = !!c.req.query("audio");
	if (isAudioOnly) {
		const audio = `#EXTM3U
#EXT-X-VERSION:7
#EXT-X-INDEPENDENT-SEGMENTS
#EXT-X-STREAM-INF:BANDWIDTH=64000,CODECS="mp4a.40.2"
${prefix}/audio/${id}/origin/playlist.m3u8
`;
		return c.text(audio, 200, {
			"Content-Type": "application/x-mpegURL",
		});
	}
	const m3u8 = (
		await m3u8Proxy(prefix, `${prefix}/${id}/master.m3u8`)
	).replaceAll("/live", prefix);
	return c.text(m3u8, 200, {
		"Content-Type": "application/x-mpegURL",
	});
});

export default app;
