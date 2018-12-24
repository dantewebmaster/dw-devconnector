import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
// CUSTOM COMPONENTS
import ActionDialog from 'Components/ActionDialog/index';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing.unit,
    '&:first-child': {
      marginLeft: 0,
    },
  },
  input: {
    display: 'none',
  },
});

const bulkReactivateByFile = ({ classes, fields, lists, handlers }) => {

  const hiddenInputOnClick = event => event.target.value = null;

  const confirmFileImport = confirmed => event => {
    handlers.handleBulkReactivateImport('bulkReactivateImportFile', confirmed)(event);
  };

  const isCompleted = lists.bulkReactivateQueue !== null &&
    ((lists.bulkReactivateQueue.length > 0 && lists.bulkReactivateQueue[0].isCompleted) ||
      lists.bulkReactivateQueue.length === 0);

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Grid container spacing={40} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="body2">
              <FormattedMessage
                id="bulk_reactivate.import_file_hint"
                defaultMessage="Importe um arquivo .xls para reativação de pessoas."
                description="Instruções - Importe um arquivo .xls para reativação de pessoas."
              />
            </Typography>
          </Grid>
          {fields.bulkReactivateImportFile &&
            fields.bulkReactivateImportFile.length === 1 &&
            fields.bulkReactivateImportFile[0].name &&
            <Grid item xs={12}>
              <Typography>
                <FormattedMessage
                  id="common.selected_file"
                  defaultMessage="Arquivo selecionado: {filename}"
                  description="Exibe o nome do arquivo selecionado"
                  values={{ filename: fields.bulkReactivateImportFile[0].name }}
                />
              </Typography>
            </Grid>}
          <Grid item xs={12}>
            <input
              className={classes.input}
              disabled={fields.processingFile}
              id="import-file"
              type="file"
              accept=".xlsx"
              onChange={handlers.handleChangeFile('bulkReactivateImportFile')}
              onClick={hiddenInputOnClick}
            />
            <label htmlFor="import-file">
              <Button
                variant="contained"
                color="primary"
                component="span"
                className={classes.button}
                disabled={!isCompleted}
              >
                <FormattedMessage
                  id="common.import"
                  defaultMessage="Importar"
                  description="Rótulo comum - Importar"
                />
              </Button>
            </label>
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={handlers.handleBatchReactivateTemplateDownload}
            >
              <FormattedMessage
                id="common.download_template"
                defaultMessage="Baixar Template"
                description="Rótulo comum - Baixar Template"
              />
            </Button>
          </Grid>
        </Grid>
      </div>

      {fields.bulkReactivateImportFile
        && fields.bulkReactivateImportFile.length === 1
        && fields.bulkReactivateImportFile[0].name &&
        <ActionDialog
          open={true}
          iconType="info"
          title={fields.bulkReactivateImportFile[0].name}
          desc={<FormattedMessage
            id="modal.file_will_be_processed"
            defaultMessage="O arquivo será processado pelo sistema. Deseja continuar?"
            description="Aviso de processamento do arquivo importado"
          />}
          confirmMode
          onCancel={confirmFileImport(false)}
          onConfirm={confirmFileImport(true)}
        />
      }
    </React.Fragment>
  );
};

bulkReactivateByFile.propTypes = {
  classes: PropTypes.object,
  fields: PropTypes.object.isRequired,
  lists: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
};

export default withStyles(styles)(bulkReactivateByFile);
