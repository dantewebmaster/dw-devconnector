import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';

const UnauthorizedPage = () => {
  return (
    <Paper style={{ padding: '80px', textAlign: 'center' }}>
      <SentimentDissatisfiedIcon style={{ fontSize: '60px' }} color="disabled" />
      <Typography variant="subtitle1" gutterBottom>
        <FormattedMessage
          id="unauthorized.title"
          defaultMessage="Oops! Não Autorizado"
          description="Título da página de acesso negado"
        />
      </Typography>
      <Typography variant="subtitle2">
        <FormattedMessage
          id="unauthorized.message"
          defaultMessage="Você não possui permissão para acessar este recurso"
          description="Mensagem de acesso negado"
        />
      </Typography>
    </Paper>);
};

export default UnauthorizedPage;
