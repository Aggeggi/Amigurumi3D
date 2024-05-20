package entities

import (
	"github.com/kamva/mgm/v3"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	mgm.DefaultModel `bson:",inline"`
	Username         string `json:"username" bson:"username"`
	Password         string `json:"password" bson:"password"`
}

func NewUser(username string, password string) *User {
	bytePassword := []byte(password)
	hashedPassword, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
    if err != nil {
        panic(err)
    }
	return &User{
		Username:   username,
		Password: string(hashedPassword),
	}
}