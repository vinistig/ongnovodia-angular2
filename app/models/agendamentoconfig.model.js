/**
 * Agendamento Config
 */
const mongoose = require('mongoose')
const Schema   = mongoose.Schema
const ObjectID = Schema.ObjectId
const objectId = mongoose.Types.ObjectId

const Errors      = apprequire('helpers/errors.helper')
const hasObjectId = apprequire('helpers/has-object-id.helper')

/* model schema */

const schema = new Schema({
	name:                  { type: String, require: true, unique: true },
	agendamentoDay:        { type: String, required: true},
    inscriptionDays:       [{startDay: { type:String, required: true }},
                            {endDay: { type: String, required: true }}],
    inscriptionime:       [{startTime: { type:String, required: true }},{endTime: { type: String, required: true }}],
    minsPerInscription: {type: String, required: true}
    simultanious: {type: Number, min: 1, max: 100  }
})

module.exports = mongoose.model('Agendamento', schema)
