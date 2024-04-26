export interface Task {
    location: string
    command: string
    target: string
}

export interface TaskResponse {
    output: string
}

export interface TracerouteHop {
    ip: string
    longitude: number
    latitude: number
}

export interface TracerouteTaskResponse extends TaskResponse {
    hops: TracerouteHop[]
}
