import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import BatchReactivateProcessing from './BatchReactivateProcessing';
import BatchReactivateStatus from './BatchReactivateStatus';
import BatchReactivateSuccess from './BatchReactivateSuccess';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl';

const Processing = ({ fields, lists, handlers }) => {
  const isCompleted = lists.bulkReactivateQueue !== null &&
    ((lists.bulkReactivateQueue.length > 0 && lists.bulkReactivateQueue[0].isCompleted) ||
      lists.bulkReactivateQueue.length === 0);

  const displayStatus = lists.bulkReactivateQueue !== null &&
    (lists.bulkReactivateQueue.length > 0 && lists.bulkReactivateQueue[0].isCompleted) &&
    lists.bulkReactivateLog !== null;
  let statusList = [];
  if (lists.bulkReactivateQueue && lists.bulkReactivateQueue.length > 0)
    statusList = lists.bulkReactivateQueue && lists.bulkReactivateQueue[0]['status'];

  const qtySuccess = statusList.find(s => s.status === 3) || { quantity: 0 };
  const qtyErrors = statusList.find(s => s.status === 4 || s.status === 5) || { quantity: 0 };

  return (
    <React.Fragment>
      {!isCompleted &&
        <Grid item xs={12}><BatchReactivateProcessing handlers={handlers} /></Grid>}

      {displayStatus &&
        <React.Fragment>
          <Typography component="h3" style={{ marginBottom: '16px' }}>
            <FormattedMessage
              id="message.last_proccess_result"
              defaultMessage="Resultados do último processamento"
              description="Mensagem - Resultados do último processamento"
            />
          </Typography>
          <Grid item xs={12}>

            {qtySuccess.quantity > 0 &&
              <BatchReactivateSuccess
                qtySuccess={qtySuccess && qtySuccess.quantity}
                qtyErrors={qtyErrors && qtyErrors.quantity}
              />}

            {qtyErrors.quantity > 0 &&
              <BatchReactivateStatus
                fields={fields}
                lists={lists}
                handlers={handlers}
              />}

          </Grid>
        </React.Fragment>}

      {lists.bulkReactivateQueue !== null &&
        lists.bulkReactivateQueue.length === 0 &&
        <Typography align="center" style={{ margin: '32px' }}>
          <FormattedMessage
            id="message.proccess_not_found"
            defaultMessage="Não existem processamentos em andamento"
            description="Mensagem quando não há processamentos"
          />
        </Typography>}
    </React.Fragment>
  );
};

Processing.propTypes = {
  classes: PropTypes.object,
  fields: PropTypes.object.isRequired,
  lists: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
};

export default Processing;
