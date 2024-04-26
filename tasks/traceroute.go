package tasks

import (
	"net"
	"strings"
    "regexp"

	"github.com/dutchis/looking-glass/config"
	"github.com/dutchis/looking-glass/clients"

	"github.com/spf13/viper"
	"github.com/oschwald/geoip2-golang"
)

type TracerouteHop struct {
	IP string `json:"ip"`
	Latitude float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type TracerouteTaskResponse struct {
	Output string `json:"output"`
	Hops []TracerouteHop `json:"hops"`
}

func StartTracerouteTask(ipAddress net.IP, location config.Location) (output TracerouteTaskResponse, err error) {
	sshClient, err := clients.GetSSHConnection(location)
	if err != nil {
		return TracerouteTaskResponse{}, err
	}
	defer sshClient.Close()

	sshOutput, err := sshClient.Run("traceroute -m 10 " + ipAddress.String())
	if err != nil {
		return TracerouteTaskResponse{}, err
	}

	tracerouteTaskResponse := TracerouteTaskResponse{
		Output: string(sshOutput),
		Hops: []TracerouteHop{},
	}

	geodb, err := geoip2.Open(viper.GetString("geolite2.database-path"))
	if err != nil {
		return TracerouteTaskResponse{}, err
	}
	defer geodb.Close()

	tracerouteOutput := strings.Split(string(sshOutput), "\n")[1:]
	// TODO: Add IPv6 support
	pattern := regexp.MustCompile(`\((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\)`)

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
			return TracerouteTaskResponse{}, err
		}

		// append to hops
		tracerouteTaskResponse.Hops = append(tracerouteTaskResponse.Hops, TracerouteHop{
			IP: ip,
			Latitude: record.Location.Latitude,
			Longitude: record.Location.Longitude,
		})
	}

	return tracerouteTaskResponse, nil
}
