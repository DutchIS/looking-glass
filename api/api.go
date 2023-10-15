package api

import (
	"fmt"
	"net"
	"time"
	"context"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
	"github.com/go-playground/validator/v10"
)

type Config struct {
	IP 		string `mapstructure:"ip"`
	Port 	int `mapstructure:"port"`
}

type API struct {
	errChan		chan error
	logger 		*logrus.Logger
	ctx 		context.Context
	router 		*mux.Router
	validator  	*validator.Validate
	config 		Config
}

func New(
	logger 	*logrus.Logger,	
	ctx 	context.Context, 
	errChan	chan error,
	config  Config,
) *API {
	return &API{
		logger: logger,
		ctx: ctx,
		errChan: errChan,
		validator: validator.New(),
		router: mux.NewRouter(),
		config: config,
	}
}

func (api *API) Start() {
	api.router.PathPrefix("/").HandlerFunc(api.GetAdmin).Methods(http.MethodGet)
	api.router.HandleFunc("/api/task/start", api.HandleTaskStart).Methods(http.MethodPost)

	// Error handlers
	api.router.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		api.SendErrorResponse(w, "Route not found", http.StatusNotFound)
	})

	api.router.MethodNotAllowedHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		api.SendErrorResponse(w, "Request method not allowed", http.StatusNotFound)
	})

	// Server!
	httpServer := &http.Server{
		Handler: api.router,
		ReadHeaderTimeout: 5 * time.Second,
	}

	go func (errChan chan<- error) {
		ipPortCombo := fmt.Sprintf("%s:%d", api.config.IP, api.config.Port)

		httpListener, err := net.Listen("tcp", ipPortCombo)
		if err != nil {
			errChan <- err
			return
		}

		api.logger.Info("Starting metrics HTTP server on http://" + ipPortCombo)

		httpServer.Serve(httpListener)
	}(api.errChan)

	// Shutdown
	<-api.ctx.Done()
	api.logger.Info("Stopping HTTP servers")

	const timeout = 30 * time.Second
	srvCtx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	httpServer.Shutdown(srvCtx)
}
