package config

import (
	"github.com/spf13/viper"
)

type APIConfig struct {
	IP 		string `mapstructure:"ip"`
	Port 	int `mapstructure:"port"`
}

type Branding struct {
	LogoURL string `mapstructure:"logo-url" json:"logoUrl"`
}

type Location struct {
	Label string `mapstructure:"label" json:"label"`
	Host string `mapstructure:"host" json:"-"`
	Username string `mapstructure:"username" json:"-"`
	Password string `mapstructure:"password" json:"-"`
	KeyPath string `mapstructure:"key-path" json:"-"`
	KeyPassword string `mapstructure:"key-password" json:"-"`
}

type Config struct {
	Debug bool `mapstructure:"debug" json:"debug"`
	API APIConfig `mapstructure:"api" json:"-"`
	Branding Branding `mapstructure:"branding" json:"branding"`
	Locations map[string]Location `mapstructure:"locations" json:"locations"`
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

func GetConfig() Config {
	return config
}
