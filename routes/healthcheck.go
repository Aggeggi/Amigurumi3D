package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

//	@BasePath	/api/v1

// Ping godoc
//	@Summary	Ping healthcheck
//	@Schemes
//	@Description	Do ping
//	@Tags			healthcheck
//	@Accept			json
//	@Produce		json
//	@Success		200	{string}	Helloworld
//	@Router			/ping [get]
func Ping(g *gin.Context)  {
	g.JSON(http.StatusOK,"helloworld")
}