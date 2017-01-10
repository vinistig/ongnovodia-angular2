const Agendamento           = apprequire('models/agendamento.model')
const AgendamentoConfig     = apprequire('models/agendamentoconfig.model')
const Errors                = apprequire('helpers/errors.helper')
const ErrorHandler          = apprequire('helpers/error-handler.helper')


class AgendamentoController {
    constructor(){}

    newAgendamentoConfig(req, res){
        AgendamentoConfig.createNewConfig(req.body)
        .then(agendamento => res.status(200).json(agendamento))
        .catch(err => ErrorHandler.toRequest(err, res))
    }

    listAllAgengamentosConfig(req, res){
        AgendamentoConfig.listAll(req.body)
        .then(agendamentosConfigs => res.status(200).json(agendamentosConfigs))
        .catch(err => ErrorHandler.toRequest(err, res))
    }
}

module.exports = AgendamentoController;
