package config

import (
	
	"github.com/dutchis/looking-glass/api"

	"github.com/spf13/viper"
)

type Branding struct {
	LogoURL string `mapstructure:"logoUrl" json:"logoUrl"`
}

type SSHClient struct {
	Type string `mapstructure:"type" json:"-"`
	Username string `mapstructure:"username" json:"-"`
	Password string `mapstructure:"password" json:"-"`
	KeyPath string `mapstructure:"keyPath" json:"-"`
	KeyPassword string `mapstructure:"keyPassword" json:"-"`
}

type Location struct {
	ID string `mapstructure:"id" json:"id"`
	Label string `mapstructure:"label" json:"label"`
	Host string `mapstructure:"host" json:"-"`
	Clients []SSHClient `mapstructure:"clients" json:"-"`
}

type Config struct {
	Debug bool `mapstructure:"debug"`
	API api.Config `mapstructure:"api"`
	Branding Branding `mapstructure:"branding"`
}

var config Config

// Load the config file from path
func LoadConfig(path *string) (Config, error) {
	viper.SetConfigType("yaml")
	viper.SetConfigFile(*path)

	err := viper.ReadInConfig()
	if err != nil {
		return Config{}, err
	}

	err = viper.Unmarshal(&config)
	if err != nil {
		return Config{}, err
	}

	return config, nil
}
