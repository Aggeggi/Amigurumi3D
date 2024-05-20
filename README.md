To generate doc
go install github.com/swaggo/swag/cmd/swag@latest
swag init --parseDependency --parseInternal
To run project
go run main.go