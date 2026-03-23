// HTTP handler for websocket-based live mock interviews.
// This is currently a placeholder that returns 501.
//
// When you are ready, replace this with a real websocket upgrade and
// integrate gorilla/websocket (or similar).

package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func notImplementedWebsocket(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{
		"error": "websocket live interviews not implemented in this scaffold",
	})
}

