package main

import (
	"os"
	"flag"
	"syscall"
	"context"
	"os/signal"

	"github.com/dutchis/looking-glass/api"
	"github.com/dutchis/looking-glass/config"
	
	"github.com/spf13/viper"
	"github.com/sirupsen/logrus"
)

var (
	cfg config.Config
	log	= logrus.New()
	errChan = make(chan error)
)

func init() {
	log.Info("Starting...")
	configPath := flag.String("config", "config.yaml", "Full path to your config file")
	flag.Parse()

	cfg, err := config.LoadConfig(*configPath)
	
	log.Info("Read config file successfully")

	if (viper.GetBool("debug")) {
		log.SetLevel(logrus.DebugLevel)
	} else {
		log.SetLevel(logrus.InfoLevel)
	}

	log.SetFormatter(&logrus.TextFormatter{
		FullTimestamp: true,
	})
}

func main() {
	go func () {
		for {
			select {
			case err := <-errChan:
				log.WithError(err).Error("An error occurred")
			}
		}
	}()

	stopCtx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	apiServer := api.New(log, stopCtx, errChan, cfg.API)
	go apiServer.Start()

	<-stopCtx.Done()

	log.Info("Exited")
}
