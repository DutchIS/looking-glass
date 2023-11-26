export interface Task {
    location: string
    command: string
    target: string
}

export interface TaskResponse {
    output: string
}

export interface MTRHop {
    ip: string
    longitude: number
    latitude: number
}

export interface MTRTaskResponse extends TaskResponse {
    hops: MTRHop[]
}
