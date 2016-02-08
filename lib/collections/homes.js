Homes = new Mongo.Collection('homes');

HomeSchema = new SimpleSchema({
	"name": {
		type: String,
	},
	"address": {
		type: String,
	},
	"year": {
		type: Number,
		min: 1000,
		max: new Date().getFullYear()
	},
	"latitude": {
		type: Number,
		min: -90.0,
		max: 90.0,
		decimal: true
	},
	"longitude": {
		type: Number,
		min: -180,
		max: 180,
		decimal: true
	}
});

Homes.attachSchema(HomeSchema);