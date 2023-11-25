package tasks

import (
	"net"
	"strings"
    "regexp"

	"github.com/dutchis/looking-glass/config"
	"github.com/dutchis/looking-glass/clients"

	"github.com/oschwald/geoip2-golang"
)

type MTRHop struct {
	IP string `json:"ip"`
	Latitude float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type MTRTaskResponse struct {
	Output string `json:"output"`
	Hops []MTRHop `json:"hops"`
}

func StartMTRTask(ipAddress net.IP, location config.Location) (output MTRTaskResponse, err error) {
	sshClient, err := clients.GetSSHConnection(location)
	if err != nil {
		return MTRTaskResponse{}, err
	}
	defer sshClient.Close()

	sshOutput, err := sshClient.Run("traceroute -m 10 " + ipAddress.String())
	if err != nil {
		return MTRTaskResponse{}, err
	}

	mtrTaskResponse := MTRTaskResponse{
		Output: string(sshOutput),
		Hops: []MTRHop{},
	}

	geodb, err := geoip2.Open("GeoLite2-City.mmdb")
	if err != nil {
		return MTRTaskResponse{}, err
	}
	defer geodb.Close()

	// drop the first line
	tracerouteOutput := strings.Split(string(sshOutput), "\n")[1:]
	pattern := regexp.MustCompile(`\((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\)`)

	// foreach line
	for _, line := range tracerouteOutput {
		ips := pattern.FindAllStringSubmatch(string(line), -1)
		if len(ips) == 0 {
			continue
		}

		ip := ips[0][1]

		// lookup ip
		ipAddress := net.ParseIP(ip)

		record, err := geodb.City(ipAddress)
		if err != nil {
			return MTRTaskResponse{}, err
		}

		// append to hops
		mtrTaskResponse.Hops = append(mtrTaskResponse.Hops, MTRHop{
			IP: ip,
			Latitude: record.Location.Latitude,
			Longitude: record.Location.Longitude,
		})
	}

	return mtrTaskResponse, nil
}
