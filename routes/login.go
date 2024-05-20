package routes

import (
	"net/http"

	"github.com/Aggeggi/Amigurumi3D-be/entities"
	"github.com/Aggeggi/Amigurumi3D-be/requests"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/kamva/mgm/v3"
	"github.com/rs/xid"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

//	@BasePath	/api/v1

// PostAmigurumi godoc
//
//	@Summary	Login user
//	@Schemes
//	@Description	Login a user
//	@Tags			user
//	@Accept			json
//	@Produce		json
//
// @Param user body requests.UserRequest true "user info"
//
//	@Success		200	{string}	ok
//	@Router			/login [post]
func Login(context *gin.Context) {
	body := requests.UserRequest{}
	if err := context.BindJSON(&body); err != nil {
		context.AbortWithError(http.StatusBadRequest, err)
		return
	}

	coll := mgm.Coll(&entities.User{})
	result := []entities.User{}
	err := coll.SimpleFind(&result, bson.M{"username": body.Username})

	if err != nil {
		context.AbortWithError(http.StatusBadRequest, err)
		return
	}
	if len(result) == 0 {
		context.AbortWithStatusJSON(http.StatusUnauthorized, "Username or password invalid")
		return
	}
	errBycrpt := bcrypt.CompareHashAndPassword([]byte(result[0].Password), []byte(body.Password))
	if errBycrpt != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, "Username or password invalid")
		return
	}
	sessionToken := xid.New().String()
	session := sessions.Default(context)
	session.Set("username", result[0].Username)
	session.Set("token", sessionToken)
	session.Set("userId", result[0].ID.Hex())
	session.Options(sessions.Options{MaxAge: 10 * 60}) // 10 minutes age
	if err := session.Save(); err != nil {
		context.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	context.JSON(http.StatusOK, result[0].Username)
}


// Logout godoc
//
//	@Summary	Logout user
//	@Schemes
//	@Description	Logout a user
//	@Tags			user
//	@Produce		json
//	@Success		200	{string}	Signed out
//	@Router			/logout [post]
func Logout(c *gin.Context) {
	session := sessions.Default(c)
	session.Clear()
	session.Options(sessions.Options{MaxAge: -1})
	if err := session.Save(); err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Signed out",
	})
}