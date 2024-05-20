package entities

import (
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type StitchType string

const (
	SC  StitchType = "SC"
	INC StitchType = "INC"
	DEC StitchType = "DEC"
)

type AmigurumiLayer struct {
	Pattern []StitchType `json:"pattern" bson:"pattern"`
	Times   int32        `json:"times" bson:"times"`
}

type AmigurumiLayerContainer struct {
	Layers []AmigurumiLayer `json:"layers" bson:"layers"`
	Times  int32            `json:"times" bson:"times"`
}

type AmigurumiPattern struct {
	mgm.DefaultModel `bson:",inline"`
	UserId           primitive.ObjectID        `bson:"userId" json:"userId"`
	Name             string                    `json:"name" bson:"name"`
	Layers           []AmigurumiLayerContainer `json:"layers" bson:"layers"`
}

func NewAmigurumiPattern(name string, layers []AmigurumiLayerContainer, userId string) *AmigurumiPattern {
	objID, _ := primitive.ObjectIDFromHex(userId)
	return &AmigurumiPattern{
		Name:   name,
		Layers: layers,
		UserId: objID,
	}
}
