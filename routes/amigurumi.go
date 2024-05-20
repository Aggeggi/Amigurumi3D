package routes

import (
	"net/http"

	"github.com/Aggeggi/Amigurumi3D-be/entities"
	"github.com/Aggeggi/Amigurumi3D-be/requests"
	"github.com/Aggeggi/Amigurumi3D-be/responses"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

//	@BasePath	/api/v1

// PostAmigurumi godoc
//
//	@Summary	Insert an amigurumi in db
//	@Schemes
//	@Description	Add a new amigurumi
//	@Tags			amigurumi
//	@Accept			json
//	@Produce		json
//
// @Param amigurumi body requests.AmigurumiPattern true "amigurumi info"
//
//	@Success		200	{string}	Amigurumi name
//	@Router			/amigurumi [post]
func PostAmigurumi(context *gin.Context) {
	session := sessions.Default(context)
	userId := session.Get("userId").(string)
	body := requests.AmigurumiPattern{}
	if err := context.BindJSON(&body); err != nil {
		context.AbortWithError(http.StatusBadRequest, err)
		return
	}
	amigurumi := entities.NewAmigurumiPattern(body.Name, body.Layers, userId)
	if err := mgm.Coll(amigurumi).Create(amigurumi); err != nil {
		context.AbortWithError(http.StatusBadRequest, err)
		return
	}
}

// GetListAmigurumi godoc
//
//	@Summary	List of amigurumis
//	@Schemes
//	@Description	Get list of amigurumis
//	@Tags			amigurumi
//	@Accept			json
//	@Produce		json
//	@Success		200	{object} responses.AmigurumiPatternWithIdResponse
//	@Router			/amigurumi [get]
func GetListAmigurumi(context *gin.Context) {
	session := sessions.Default(context)
	userId := session.Get("userId").(string)
	coll := mgm.Coll(&entities.AmigurumiPattern{})
	result := []responses.AmigurumiPatternWithIdResponse{}
	objIDUserId, _ := primitive.ObjectIDFromHex(userId)
	err := coll.SimpleFind(&result, bson.M{"userId": objIDUserId})

	if err != nil {
		context.AbortWithError(http.StatusBadRequest, err)
		return
	}

	context.JSON(http.StatusOK, result)
}

// GetAmigurumi godoc
//
//	@Summary	Amigurumi pattern
//	@Schemes
//	@Description	Get a pattern for an amigurumi
//	@Tags			amigurumi
//	@Accept			json
//	@Produce		json
//
// @Param        id   path      string  true  "Amigurumi ID"
//
//	@Success		200	{object} responses.AmigurumiPatternResponse
//	@Router			/amigurumi/{id} [get]
func GetAmigurumi(context *gin.Context) {
	session := sessions.Default(context)
	userId := session.Get("userId").(string)
	id := context.Param("id")
	objID, castErr := primitive.ObjectIDFromHex(id)
	if castErr != nil {
		context.AbortWithError(http.StatusBadRequest, castErr)
		return
	}
	coll := mgm.Coll(&entities.AmigurumiPattern{})
	result := []responses.AmigurumiPatternResponse{}
	objIDUserId, _ := primitive.ObjectIDFromHex(userId)
	err := coll.SimpleFind(&result, bson.M{"_id": objID, "userId": objIDUserId})

	if err != nil {
		context.AbortWithError(http.StatusBadRequest, err)
		return
	}

	context.JSON(http.StatusOK, result[0])
}
