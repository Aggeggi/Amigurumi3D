package responses

type AmigurumiPatternWithIdResponse struct {
	Name string `json:"name" bson:"name"`
	Id   string `json:"id" bson:"_id"`
}
