import { useEffect, useState } from "react";

interface VersionInfo {
	version: string;
	loading: boolean;
	error: string | null;
}

// Cache the version globally to avoid multiple fetches
let cachedVersion: string | null = null;
let fetchPromise: Promise<string> | null = null;

async function fetchLatestVersion(): Promise<string> {
	if (cachedVersion) return cachedVersion;

	if (fetchPromise) return fetchPromise;

	fetchPromise = fetch(
		"https://api.github.com/repos/TryCadence/Cadence/releases/latest",
		{
			headers: {
				Accept: "application/vnd.github.v3+json",
			},
		},
	)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`Failed to fetch version: ${response.status}`);
			}
			return response.json();
		})
		.then((data) => {
			const version = data.tag_name || "v0.0.0";
			cachedVersion = version;
			return version;
		})
		.catch(() => {
			// Fallback version if fetch fails
			return "v0.2.1";
		});

	return fetchPromise;
}

export function useVersion(): VersionInfo {
	const [version, setVersion] = useState<string>(cachedVersion || "v0.2.1");
	const [loading, setLoading] = useState(!cachedVersion);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (cachedVersion) {
			setVersion(cachedVersion);
			setLoading(false);
			return;
		}

		fetchLatestVersion()
			.then((v) => {
				setVersion(v);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, []);

	return { version, loading, error };
}

// Get version without the 'v' prefix
export function useVersionNumber(): string {
	const { version } = useVersion();
	return version.replace(/^v/, "");
}
