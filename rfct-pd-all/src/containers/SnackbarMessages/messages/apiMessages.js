import { defineMessages } from 'react-intl';

const apiMessages = defineMessages({
  "ADD_PARAMETER": {
    id: "ADD_PARAMETER",
    defaultMessage: "Parâmetro adicionado com sucesso",
    description: "Paramater successfully done"
  },
  "ADD_PARAMETER_ERROR": {
    id: "ADD_PARAMETER_ERROR",
    defaultMessage: "Erro ao adicionar parâmetro",
    description: "There was an error while adding parameter"
  },
  "VALIDATE_CYCLE": {
    id: "VALIDATE_CYCLE",
    defaultMessage: "Movimentação será realizada no fechamento do ciclo: {cycle}. Deseja continuar?",
    description: "Mensagem do modal - Validar ciclo"
  },
  "CREATED_SUCCESSFULLY": {
    id: "CREATED_SUCCESSFULLY",
    defaultMessage: "Agendamento realizado com sucesso",
    description: "Scheduling successfully done"
  },
  "CANCELED_SUCCESSFULLY": {
    id: "CANCELED_SUCCESSFULLY",
    defaultMessage: "Agendamento cancelado com sucesso",
    description: "Scheduling successfully canceled"
  },
  "MOVED_SUCCESSFULLY": {
    id: "MOVED_SUCCESSFULLY",
    defaultMessage: "Movimentação realizada com sucesso",
    description: "Movement successfully done"
  },
  "UPDATED_SUCCESSFULLY": {
    id: "UPDATED_SUCCESSFULLY",
    defaultMessage: "Atualizado com sucesso",
    description: "Successfully done"
  },
  "STRUCTURE_CHANGE_PRIORITY": {
    id: 'STRUCTURE_CHANGE_PRIORITY',
    defaultMessage: "Prioridade já existe",
    description: 'The priority already exists in the cycle in the structure change rule'
  },
  "LEAP_CYCLE_ERROR": {
    id: 'LEAP_CYCLE_ERROR',
    defaultMessage: "Movimentação resulta em um salto de ciclo",
    description: 'Movimentação resulta em um salto de ciclo'
  },
  "KICKBACK_CYCLE_ERROR": {
    id: 'KICKBACK_CYCLE_ERROR',
    defaultMessage: "Movimentação resulta em um retrocesso de ciclo",
    description: 'Movimentação resulta em um retrocesso de ciclo'
  },
  "MOVEMENT_INVALID": {
    id: "MOVEMENT_INVALID",
    defaultMessage: "A CN possui papel e função de responsável.",
    description: "A CN possui papel e função de responsável."
  },
});

export default apiMessages;
