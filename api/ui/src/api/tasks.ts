import { API } from "."
import { Task } from "./types"

const TaskAPI = API.injectEndpoints({
    endpoints: (builder) => ({
        startTask: builder.mutation<void, Task>({
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