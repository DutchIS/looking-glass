package tasks

import (
	"net"

	"github.com/dutchis/looking-glass/config"
	"github.com/dutchis/looking-glass/clients"
)

func StartPingTask(ipAddress net.IP, location config.Location) (output []byte, err error) {
	sshClient, err := clients.GetSSHConnection(location)
	if err != nil {
		return nil, err
	}
	defer sshClient.Close()

	output, err = sshClient.Run("ping -c 5 " + ipAddress.String())
	if err != nil {
		return nil, err
	}

	return output, nil
}
