package api

import (
	"net/http"
	"encoding/json"
)

type Task struct {
	Location string `json:"location"`
	Command string `json:"command"`
	Target string `json:"target"`
}

func (api *API) HandleTaskStart(w http.ResponseWriter, req *http.Request) {
	var task Task
	err := json.NewDecoder(req.Body).Decode(&task)
    if err != nil {
		api.SendErrorResponse(w, "Error while decoding request body", http.StatusBadRequest)
        return
    }

	api.WriteJSONResponse(w, req, http.StatusOK, nil)
}
