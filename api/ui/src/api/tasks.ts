import { API } from "."
import { Task, TaskResponse } from "./types"

const TaskAPI = API.injectEndpoints({
    endpoints: (builder) => ({
        startTask: builder.mutation<TaskResponse, Task>({
            query: (task) => ({
                url: `/api/task/start`,
                method: "POST",
                body: task
            })
        }),
    })
})

export const {
    useStartTaskMutation,
} = TaskAPI