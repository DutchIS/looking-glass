package api

import (
	"net"
	"net/http"
	"encoding/json"

	"github.com/dutchis/looking-glass/tasks"
	"github.com/dutchis/looking-glass/config"
)

type Task struct {
	Location string `json:"location" validate:"required"`
	Command string `json:"command" validate:"required"`
	Target string `json:"target" validate:"required"`
}

func (api *API) HandleTaskStart(w http.ResponseWriter, req *http.Request) {
	var task Task
	err := json.NewDecoder(req.Body).Decode(&task)
    if err != nil {
		api.SendErrorResponse(w, "Error while decoding request body", http.StatusBadRequest)
        return
    }

	ip := net.ParseIP(task.Target)
	if ip == nil {
		api.SendErrorResponse(w, "Invalid IP address", http.StatusBadRequest)
		return
	}

	location, ok := config.GetConfig().Locations[task.Location]
	if !ok {
		api.SendErrorResponse(w, "Invalid location", http.StatusBadRequest)
		return
	}

	switch task.Command {
	case "ping4":
		fallthrough
	case "ping6":
		output, err := tasks.StartPingTask(ip, location)
		if err != nil {
			api.SendErrorResponse(w, "Error while running task", http.StatusInternalServerError)
			return
		}

		api.WriteJSONResponse(w, req, http.StatusOK, struct {
			Output string `json:"output"`
		}{
			Output: string(output),
		})

		break
	case "mtr4":
		fallthrough
	case "mtr6":
		output, err := tasks.StartMTRTask(ip, location)
		if err != nil {
			api.SendErrorResponse(w, "Error while running task", http.StatusInternalServerError)
			return
		}

		api.WriteJSONResponse(w, req, http.StatusOK, output)
		return
	}
}
