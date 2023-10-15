package tasks

import (
	"net"

	"github.com/dutchis/looking-glass/clients"
)

func StartPingTask(ipAddress net.IP) (output []byte, err error) {
	sshClient, err := clients.GetSSHClient("root", ipAddress.String())
	defer sshClient.Close()

	output, err = sshClient.Run("ping -c 5 " + ipAddress.String() + " | tail -n 1 | awk '{print $4}' | cut -d '/' -f 2")
	if err != nil {
		return nil, err
	}

	return output, nil
}
