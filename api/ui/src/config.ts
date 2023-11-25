interface Location {
    label: string,
}

interface WebConfig {
    debug: boolean,
    branding: {
        logoUrl: string
    },
    locations: Map<string, Location>
}

// @ts-ignore - webConfig is injected by the server
const config: WebConfig = window.webConfig
export default config;
