interface WebConfig {
    branding: {
        logoUrl: string
    }
}

export default function GetConfig() {
    // @ts-ignore - webConfig is injected by the server
    const config: WebConfig = window.webConfig

    return config
}
