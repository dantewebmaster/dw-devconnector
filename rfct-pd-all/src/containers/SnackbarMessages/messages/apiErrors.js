import { defineMessages } from 'react-intl';

const apiErrors = defineMessages({
  "NETWORK_ERROR": {
    id: "NETWORK_ERROR",
    defaultMessage: "Erro de comunicação com o servidor",
    description: "There was an error while trying to connect to server.",
  },
  "ERROR_NOT_HANDLED": {
    id: "ERROR_NOT_HANDLED",
    defaultMessage: "Erro desconhecido",
    description: "There was an unhandled error",
  },
  "UNKNOWN": {
    id: 'UNKNOWN',
    defaultMessage: 'Falha ao executar esta ação devido a uma causa desconhecida',
    description: 'Unfortunately this error does not provide more information',
  },
  "BAD_REQUEST_PARAMETER": {
    id: 'BAD_REQUEST_PARAMETER',
    defaultMessage: 'Um ou mais campos contém valores inválidos',
    description: 'An input value was not accepted',
  },
  "DELETE_FK_ERROR": {
    id: 'DELETE_FK_ERROR',
    defaultMessage: 'Registro com dados vinculados',
    description: '#DATA_NAME has child data',
  },
  "PERSON_NOT_FOUND": {
    id: 'PERSON_NOT_FOUND',
    defaultMessage: 'Pessoa não encontrada',
    description: 'Unable to find requested person',
  },
  "UNABLE_TO_RETRIEVE_STRUCTURES": {
    id: 'UNABLE_TO_RETRIEVE_STRUCTURES',
    defaultMessage: 'Não foi possível obter as estruturas',
    description: 'Unable to retrieve structures',
  },
  "STRUCTURE_NOT_FOUND": {
    id: 'STRUCTURE_NOT_FOUND',
    defaultMessage: 'A estrutura não foi encontrada',
    description: 'Structure not found',
  },
  "STRUCTURE_CHANGE_DUPLICATE": {
    id: 'STRUCTURE_CHANGE_DUPLICATE',
    defaultMessage: 'Estrutura duplicada',
    description: 'Structure change rule already exist flag_cycle, level_origin, level_destination',
  },
  "REQUIRED_FIELDS": {
    id: 'REQUIRED_FIELDS',
    defaultMessage: 'Um ou mais campos obrigatórios não foram preenchidos',
    description: 'An input value was not informed',
  },
  "CYCLE_RESCHEDULE_LIMIT_EXCEEDED": {
    id: 'CYCLE_RESCHEDULE_LIMIT_EXCEEDED',
    defaultMessage: 'Limite de reagendamento do ciclo atingido',
    description: 'Cycle reschedule limit exceeded',
  },
  "INCOMPATIBLE_STRUCTURE_LEVELS": {
    id: 'INCOMPATIBLE_STRUCTURE_LEVELS',
    defaultMessage: 'Níveis de estrutura incompatíveis',
    description: 'Incompatible structure levels',
  },
  "PERSON_RELATIONSHIP_NOT_FOUND": {
    id: 'PERSON_RELATIONSHIP_NOT_FOUND',
    defaultMessage: 'Relação comercial não encontrada',
    description: 'Person relationship not found',
  },
  "CESSATION_REASON_NOT_FOUND": {
    id: 'CESSATION_REASON_NOT_FOUND',
    defaultMessage: "O motivo de cessação selecionado não pode ser encontrado",
    description: 'Cessation reason not found',
  },
  "PARAMETER_INVALID_GROUP_TYPE": {
    id: 'PARAMETER_INVALID_GROUP_TYPE',
    defaultMessage: "Tipo de grupo inválido",
    description: 'Invalid group type',
  },
  "CANNOT_CANCEL_AUTOMATIC_SCHEDULING": {
    id: 'CANNOT_CANCEL_AUTOMATIC_SCHEDULING',
    defaultMessage: "Não foi possível cancelar o agendamento automático",
    description: 'Cannot cancel automatic scheduling',
  },
  "SCHEDULE_NOT_FOUND": {
    id: 'SCHEDULE_NOT_FOUND',
    defaultMessage: "Agendamento não encontrado",
    description: 'Schedule not found',
  },
  "UNABLE_TO_FIND_STRUCTURE_LEVEL": {
    id: 'UNABLE_TO_FIND_STRUCTURE_LEVEL',
    defaultMessage: "Não foi possível encontrar o nível de estrutura",
    description: 'Unable to find structure level',
  },
  "UNABLE_TO_FIND_BUSINESS_MODEL": {
    id: 'UNABLE_TO_FIND_BUSINESS_MODEL',
    defaultMessage: "Não foi possível encontrar o modelo de negócios",
    description: 'Unable to find business model',
  },
  "FETCH_PERSON_INFORMATION": {
    id: 'FETCH_PERSON_INFORMATION',
    defaultMessage: "Não foi possível obter as informações da pessoa",
    description: 'Unable to fetch person information',
  },
  "FETCH_PARAMETERS": {
    id: 'FETCH_PARAMETERS',
    defaultMessage: "Não foi possível carregar os parâmetros",
    description: 'Unable to fetch parameters',
  },
  "PERSON_RELATIONSHIP_IS_CEASED": {
    id: 'PERSON_RELATIONSHIP_IS_CEASED',
    defaultMessage: "Ação não permitida para pessoa cessada",
    description: 'The person relationship status is ceased and cannot be scheduled',
  },
  "PERSON_RELATIONSHIP_IS_NOT_CEASED": {
    id: 'PERSON_RELATIONSHIP_IS_NOT_CEASED',
    defaultMessage: "Ação não permitida para pessoa ativa",
    description: 'Person relationship is not ceased'
  },
  "INVALID_STATUS_TRANSITION": {
    id: 'INVALID_STATUS_TRANSITION',
    defaultMessage: "Status da transição inválido",
    description: 'Status transition is invalid',
  },
  "ORIGIN_CYCLES_NOT_FOUND": {
    id: 'ORIGIN_CYCLES_NOT_FOUND',
    defaultMessage: "Ciclos da estrutura de origem não encontrados",
    description: 'Unable to retrieve origin cycles',
  },
  "DESTINATION_CYCLES_NOT_FOUND": {
    id: 'DESTINATION_CYCLES_NOT_FOUND',
    defaultMessage: "Ciclos da estrutura de destino não encontrados",
    description: 'Unable to retrieve destination cycles',
  },
  "CESSATION_REASON_REQUIRED": {
    id: 'CESSATION_REASON_REQUIRED',
    defaultMessage: "Motivo da cessação obrigatório",
    description: 'Cessation reason must be provided',
  },
  "NO_ACTIVE_STATUS": {
    id: 'NO_ACTIVE_STATUS',
    defaultMessage: "Não foi possível encontrar o último status ativo",
    description: 'Unable to find last active status',
  },
  "ACTIVE_STATUS": {
    id: 'ACTIVE_STATUS',
    defaultMessage: "A pessoa já está ativa",
    description: 'The person is already active',
  },
  "DATA_HAS_CHANGED": {
    id: 'DATA_HAS_CHANGED',
    defaultMessage: "Os dados foram modificados por outra pessoa",
    description: 'The data has been modified by someone else',
  },
  "SAME_STRUCTURE": {
    id: 'SAME_STRUCTURE',
    defaultMessage: 'A pessoa já está na estrutura desejada',
    description: 'The person is already in the desired structure',
  },
  "REDUCED_CYCLE_DAYS_LIMIT": {
    id: 'REDUCED_CYCLE_DAYS_LIMIT',
    defaultMessage: "Movimentação resulta em um ciclo com menos de {days} dias",
    description: 'Extended cycle with not enough days',
  },
  "API_NOT_FOUND": {
    id: 'API_NOT_FOUND',
    defaultMessage: "Houve um problema de comunicação com o servidor",
    description: 'Unable to communicate with api',
  },
  "FUNCTIONS_NOT_FOUND_FOR_STRUCTURE": {
    id: 'FUNCTIONS_NOT_FOUND_FOR_STRUCTURE',
    defaultMessage: "Funções não encontradas para a estrutura",
    description: 'Functions not found for structure'
  },
  "STRUCTURE_CHANGE_NOT_FOUND": {
    id: 'STRUCTURE_CHANGE_NOT_FOUND',
    defaultMessage: "Mudança de estrutura não encontrada",
    description: 'Structure change rule not found',
  },
  "SETTING_DUPLICATE": {
    id: 'SETTING_DUPLICATE',
    defaultMessage: "Configuração duplicada",
    description: 'Setting already exist structureLevelId and structureCode',
  },
  "UNABLE_TO_RETRIEVE_PERSON_ZIPCODE": {
    id: 'UNABLE_TO_RETRIEVE_PERSON_ZIPCODE',
    defaultMessage: "Nenhuma estrutura encontrada para o código postal",
    description: 'No structures found for zipcode',
  },
  "INVALID_ZIPCODE_FOR_STRUCTURE": {
    id: 'INVALID_ZIPCODE_FOR_STRUCTURE',
    defaultMessage: "Estrutura de destino inválida para o código postal",
    description: 'Destination structure is invalid for zipcode',
  },
  "MAX_PERSON_BY_STRUCTURE": {
    id: 'MAX_PERSON_BY_STRUCTURE',
    defaultMessage: "Limite máximo de pessoas por estrutura excedido",
    description: 'Number of people exceeded max by structure',
  },
  "UNAUTHORIZED_APPTOKEN_INVALID": {
    id: 'UNAUTHORIZED_APPTOKEN_INVALID',
    defaultMessage: "Token inválido",
    description: 'AppToken is invalid',
  },
  "UNAUTHORIZED_APPTOKEN_REQUIRED": {
    id: 'UNAUTHORIZED_APPTOKEN_REQUIRED',
    defaultMessage: "Token obrigatório",
    description: 'AppToken is required',
  },
  "SCHEDULE_NOT_FOUND_STRUCTURE": {
    id: 'SCHEDULE_NOT_FOUND_STRUCTURE',
    defaultMessage: "Histórico de movimentações não encontrado",
    description: 'Schedule history not found',
  },
  "ONLY_NON_LEADERSHIP_ALLOWED": {
    id: 'ONLY_NON_LEADERSHIP_ALLOWED',
    defaultMessage: "Ação permitida somente para consultoras de beleza",
    description: 'Only non leadership allowed',
  },
  "STRUCTURE_CHANGE_PRIORITY": {
    id: 'STRUCTURE_CHANGE_PRIORITY',
    defaultMessage: "Prioridade já existe",
    description: 'The priority already exists in the cycle in the structure change rule',
  },
  "INVALID_RESPONSE_FROM_SELLERS": {
    id: "INVALID_RESPONSE_FROM_SELLERS",
    defaultMessage: "Resposta inválida da API SELLERS",
    description: "SELLERS API returned an invalid response",
  },
  "NO_STRUCTURES_FOUND_FOR_ZIPCODE": {
    id: "NO_STRUCTURES_FOUND_FOR_ZIPCODE",
    defaultMessage: "Estrutura não encontrada para o cep",
    description: "Estrutura não encontrada para o cep",
  },
  "CYCLE_NOT_FOUND": {
    id: 'CYCLE_NOT_FOUND',
    defaultMessage: "Ciclo não encontrado",
    description: "Ciclo não encontrado",
  },
  "ONE_OR_MORE_ERRORS": {
    id: 'ONE_OR_MORE_ERRORS',
    defaultMessage: "Uma ou mais pessoas não puderam ser agendadas",
    description: "Uma ou mais pessoas não puderam ser agendadas",
  },
  "STRUCTURE_HAS_NOT_PERSONS": {
    id: "STRUCTURE_HAS_NOT_PERSONS",
    defaultMessage: "Não há pessoas associadas na estrutura selecionada",
    description: "Não há pessoas associadas na estrutura selecionada",
  },
  "REACTIVATE_PERIOD_EXCEEDED": {
    id: "REACTIVATE_PERIOD_EXCEEDED",
    defaultMessage: "Não é possível realizar a reativação após um ciclo",
    description: "Não é possível realizar a reativação após um ciclo",
  },
  "KICKBACK_CYCLE_ERROR": {
    id: "KICKBACK_CYCLE_ERROR",
    defaultMessage: "Movimentação resulta em um retrocesso de ciclo",
    description: "Movimentação resulta em um retrocesso de ciclo",
  },
  "LEAP_CYCLE_ERROR": {
    id: "LEAP_CYCLE_ERROR",
    defaultMessage: "Movimentação resulta em um salto de ciclo",
    description: "Movimentação resulta em um salto de ciclo",
  },
  "DELIVERY_ADDRESS_NOT_FOUND": {
    id: "DELIVERY_ADDRESS_NOT_FOUND",
    defaultMessage: "Endereço de entrega não encontrado",
    description: "Endereço de entrega não encontrado",
  },
  "DESTINATION_ACTIVE_CYCLE_NOT_FOUND": {
    id: "DESTINATION_ACTIVE_CYCLE_NOT_FOUND",
    defaultMessage: "Não há ciclo ativo para estrutura de destino",
    description: "Não há ciclo ativo para estrutura de destino",
  },
  "CYCLES_NOT_FOUND": {
    id: "CYCLES_NOT_FOUND",
    defaultMessage: "Não há ciclos ativos para esta estrutura",
    description: "Não há ciclos ativos",
  },
  "INVALID_ORIGIN_STRUCTURE": {
    id: "INVALID_ORIGIN_STRUCTURE",
    defaultMessage: "Pessoa não esta na estrutura de origem",
    description: "Pessoa não esta na estrutura de origem",
  },
  "SCHEDULE_ALREADY_EXISTS": {
    id: "SCHEDULE_ALREADY_EXISTS",
    defaultMessage: "Agendamento já existe para a mesma origem e destino",
    description: "Agendamento já existe para a mesma origem e destino",
  },
  "USER_ABORTED": {
    id: "USER_ABORTED",
    defaultMessage: "Interrompido pelo usuário",
    description: "Interrompido pelo usuário",
  },
  "STRUCTURES_NOT_FOUND": {
    id: "STRUCTURES_NOT_FOUND",
    defaultMessage: "Não foram encontradas pessoas à serem reativadas na(s) estrutura(s) selecionada(s)",
    description: "Não foram encontradas pessoas à serem reativadas na(s) estrutura(s) selecionada(s)",
  },
  "INACTIVE_PEOPLE_NOT_FOUND": {
    id: "INACTIVE_PEOPLE_NOT_FOUND",
    defaultMessage: "Não foram encontradas pessoas à serem reativadas na(s) estrutura(s) selecionada(s)",
    description: "Não foram encontradas pessoas à serem reativadas na(s) estrutura(s) selecionada(s)",
  },
  "REACTIVATE_REASON_EXCEPTION": {
    id: "REACTIVATE_REASON_EXCEPTION",
    defaultMessage: "Pessoa cessada por motivo diferente de inatividade",
    description: "Pessoa cessada por motivo diferente de inatividade",
  }
});

export default apiErrors;
