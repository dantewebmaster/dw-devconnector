import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import BatchSchedulingProcessing from './BatchSchedulingProcessing';
import BatchSchedulingStatus from './BatchSchedulingStatus';
import BatchSchedulingSuccess from './BatchSchedulingSuccess';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl';

const Processing = ({ fields, lists, handlers }) => {
  const isCompleted = lists.bulkScheduleQueue !== null &&
    ((lists.bulkScheduleQueue.length > 0 && lists.bulkScheduleQueue[0].isCompleted) ||
      lists.bulkScheduleQueue.length === 0);

  const displayStatus = lists.bulkScheduleQueue !== null &&
    (lists.bulkScheduleQueue.length > 0 && lists.bulkScheduleQueue[0].isCompleted) &&
    lists.bulkScheduleLog !== null;

  let statusList = [];
  if (lists.bulkScheduleQueue && lists.bulkScheduleQueue.length > 0)
    statusList = lists.bulkScheduleQueue && lists.bulkScheduleQueue[0]['status'];

  const qtySuccess = statusList.find(s => s.status === 7) || { quantity: 0 };
  const qtyErrors = statusList.find(s => s.status === 4) || { quantity: 0 };

  return (
    <React.Fragment>
      {!isCompleted &&
        <Grid item xs={12}><BatchSchedulingProcessing handlers={handlers} /></Grid>}

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
            {qtySuccess.quantity > 0 && <BatchSchedulingSuccess qtySuccess={qtySuccess && qtySuccess.quantity} qtyErrors={qtyErrors && qtyErrors.quantity} />}

            {qtyErrors.quantity >= 0 && <BatchSchedulingStatus fields={fields} lists={lists} handlers={handlers} />}
          </Grid>
        </React.Fragment>}

      {lists.bulkScheduleQueue !== null &&
        lists.bulkScheduleQueue.length === 0 &&
        <Typography component="h3" align="center" style={{ margin: '32px' }}>
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
