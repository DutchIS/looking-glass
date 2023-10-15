package api

import (
	"reflect"
	"net/http"
	"encoding/json"
)

func (api *API) SendErrorResponse(w http.ResponseWriter, err string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	if (statusCode > 399 && statusCode < 500) {
		api.logger.Warnf("Error [%d] %s sent to client", statusCode, err)
	}
	
	if err := json.NewEncoder(w).Encode(struct {
		Error string `json:"error"`
	}{
		Error: err,
	}); err != nil {
		api.logger.Warn("Error while encoding error response")
	}
}


func (api *API) WriteJSONResponse(w http.ResponseWriter, req *http.Request, statusCode int, response interface{}) {
	shouldRespond := true
	for _, method := range []string{http.MethodHead, http.MethodDelete} {
		if req.Method == method {
			shouldRespond = false
		}
	}

	if shouldRespond {
		w.Header().Set("Content-Type", "application/json")
	}

	w.WriteHeader(statusCode)

	if !shouldRespond {
		return
	}

	val := reflect.ValueOf(response)

	if val.Kind() == reflect.Slice && val.IsNil() {
		if err := json.NewEncoder(w).Encode([]string{}); err != nil {
			api.logger.WithError(err).Error("Error while encoding empty array response")
		}

		return
	}

	if response == nil {
		if err := json.NewEncoder(w).Encode(struct{}{}); err != nil {
			api.logger.WithError(err).Error("Error while encoding empty struct response")
		}

		return
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		api.logger.WithError(err).Error("Error while encoding json response")
	}
}
