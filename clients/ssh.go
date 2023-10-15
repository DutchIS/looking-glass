package clients

import (
	"github.com/spf13/viper"
	"github.com/melbahja/goph"
)

func GetSSHClient(username string, host string) (client *goph.Client, err error) {
	auth, err := goph.Key(viper.GetString("clients.ssh.key-path"), viper.GetString("clients.ssh.password"))
	if err != nil {
		return nil, err
	}

	client, err = goph.New(username, host, auth)
	if err != nil {
		return nil, err
	}

	return client, nil
}
