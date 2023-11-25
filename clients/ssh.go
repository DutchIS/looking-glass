package clients

import (
	"github.com/dutchis/looking-glass/config"

	"github.com/melbahja/goph"
)

func GetSSHConnection(location config.Location) (client *goph.Client, err error) {
	auth, err := goph.Key(location.KeyPath, location.KeyPassword)
	if err != nil {
		return nil, err
	}

	client, err = goph.New(location.Username, location.Host, auth)
	if err != nil {
		return nil, err
	}

	return client, nil
}
