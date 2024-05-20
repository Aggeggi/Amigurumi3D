package database
import (
	"log"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func InitDb() {
	// Setup mgm default config
	credential := options.Credential{
    Username: "root",
    Password: "example",
}
	err := mgm.SetDefaultConfig(nil, "amigurumi3d", options.Client().ApplyURI("mongodb://127.0.0.1:27017/example").SetAuth(credential))
	if err != nil {
		log.Fatal(err)
	}
}