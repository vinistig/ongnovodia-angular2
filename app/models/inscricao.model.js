const mongoose    = require('mongoose')
const Schema      = mongoose.Schema
const ObjectId    = Schema.ObjectId
const objectId    = mongoose.Types.ObjectId


const schema = new Schema({
    nome            : {type: String, required: true},
    nome_pai        : {type: String, required: true},
    nome_mae        : {type: String, required: true},
    sexo            : {type: String, required: true},
    data_nascimento : {type: String, required: true},
    data_inscricao  : {type: String, required: true},
    naturalidade    : {type: String, required: true},
    etnia           : {type: String, required: true},
    estado_civil    : {type: String, required: true},
    telefone        : {type: String, required: true},
    email           : {type: String, required: true},
    religiao        : {type: String, required: true},
    deficiente      : {type: Boolean, required: true},
    deficiencia     : {type: String},
    rg              : {type: String, required: true},
    orgao_emissor   : {type: String, required: true},
    rg_data         : {type: String, required: true},
    cpf             : {type: String, required: true, unique: true},
    rua             : {type: String, required: true},
    numero          : {type: String, required: true},
    bairro          : {type: String, required: true},
    cidade          : {type: String, required: true},
    cep             : {type: String, required: true},
    estado          : {type: String, required: true},
    termos          : {type: Boolean, required: true, default: false},
    projeto         : {type: String, required: true},
    image           : {data: Buffer, contentType: String}
})

/**
 * Criar nova inscricao
 */
schema.methods.novaInscricao = function(body) {
return new Promise((resolve, reject) => {
    this.nome =  body.nome
    this.nome_pai =  body.nome_pai
    this.nome_mae =  body.nome_mae
    this.sexo =  body.sexo
    this.data_nascimento =  body.data_nascimento
    this.data_inscricao =  body.data_inscricao
    this.naturalidade =  body.naturalidade
    this.etnia =  body.etnia
    this.estado_civil =  body.estado_civil
    this.telefone =  body.telefone
    this.email =  body.email
    this.religiao =  body.religiao
    this.deficiente =  body.deficiente
    this.deficiencia =  body.deficiencia
    this.rg  =  body.rg
    this.orgao_emissor =  body.orgao_emissor
    this.rg_data =  body.rg_data
    this.cpf =  body.cpf
    this.rua =  body.rua
    this.numero =  body.numero
    this.bairro =  body.bairro
    this.cidade =  body.cidade
    this.cep =  body.cep
    this.estado = body.estado
    this.termos =  body.termos
    var b = new Buffer(body.image, 'base64')
    this.image.data =  b
    this.image.contentType = 'image/png';
    this.projeto = body.projeto

    this.save()
	.then(result => {
		resolve(result)
	})
	.catch(err => reject(err))
})
}

/**
 * Consultar Inscricao
 */
schema.statics.getInscricaoByDoc = function(doc) {
return new Promise((resolve, reject) => {
    this.find({ $or:[ { rg: doc }, { cpf: doc } ] })
    .then(result =>{
        resolve(result)
    })
    .catch(err => reject(err))
})
}

module.exports = mongoose.model('Inscricao', schema)
