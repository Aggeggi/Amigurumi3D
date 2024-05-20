package requests

import (
	"github.com/Aggeggi/Amigurumi3D-be/entities"
)

type AmigurumiPattern struct {
	Name   string                             `json:"name" bson:"name"`
	Layers []entities.AmigurumiLayerContainer `json:"layers" bson:"layers"`
}
