package responses

import (
	"time"

	"github.com/Aggeggi/Amigurumi3D-be/entities"
)

type AmigurumiPatternResponse struct {
	Name      string                             `json:"name" bson:"name"`
	Id        string                             `json:"id" bson:"_id"`
	Layers    []entities.AmigurumiLayerContainer `json:"layers" bson:"layers"`
	CreatedAt time.Time                          `json:"createdAt" bson:"created_at"`
}
