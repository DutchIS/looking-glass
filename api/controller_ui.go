package api

import (
	"fmt"
	"mime"
	"embed"
	"strings"
	"net/http"
	"encoding/json"
	"path/filepath"

	"github.com/spf13/viper"
)

type WebConfig struct {
	Branding struct {
		LogoURL string `json:"logoUrl"`
	} `json:"branding"`
}

//go:embed ui/dist
var webUI embed.FS

func (api *API) GetAdmin(w http.ResponseWriter, req *http.Request) {
	var file []byte
	var err error

	if strings.HasPrefix(req.URL.Path, "/assets/") {
		file, err = webUI.ReadFile("ui/dist" + req.URL.Path)
		if err != nil {
			http.NotFound(w, req)
			return
		}

		ctype := mime.TypeByExtension(filepath.Ext(req.URL.Path))
		if ctype == "" {
			// The algorithm uses at most sniffLen bytes to make its decision.
			const sniffLen = 512

			n := sniffLen
			if len(file) < sniffLen {
				n = len(file)
			}
			ctype = http.DetectContentType(file[:n])
		}

		w.Header().Set("Content-Type", ctype)
		w.Header().Set("Cache-Control", "max-age=31536000")

		_, err = w.Write(file)
		if err != nil {
			api.logger.WithError(err).Error("Error while writing static files")
			http.Error(w, "Error while writing file", http.StatusInternalServerError)
		}

		return
	}

	file, err = webUI.ReadFile("ui/dist/index.html")
	if err != nil {
		api.logger.WithError(err).Error("Error while writing static files")
		http.Error(w, "Error while reading index file", http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "text/html")

	webConfig := WebConfig{
		Branding: struct {
			LogoURL string `json:"logoUrl"`
		}{
			LogoURL: viper.GetString("branding.logo-url"),
		},
	}

	jsonWebConfig, err := json.Marshal(webConfig)
    if err != nil {
		api.logger.WithError(err).Error("Error while encoding web config")
		http.Error(w, "Error while encoding web config", http.StatusInternalServerError)
        return
    }

	file = []byte(strings.Replace(string(file), "<!-- DYNAMIC_CONFIG -->", fmt.Sprintf("<script>window.webConfig = %s</script>", jsonWebConfig), 1))

	_, err = w.Write(file)
	if err != nil {
		api.logger.WithError(err).Error("Error while writing static files")
		http.Error(w, "Error while writing index file", http.StatusInternalServerError)
	}
}
