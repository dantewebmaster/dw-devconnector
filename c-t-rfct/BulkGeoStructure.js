import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';
import { blue500, red500 } from 'material-ui/styles/colors';
// CUSTOM COMPONENTS
import Breadcrumbs from "components/Breadcrumbs/Breadcrumbs";
import BreadcrumbsLabel from "components/Breadcrumbs/BreadcrumbsLabel";
import ConfirmationDialog from 'components/Dialogs/ConfirmationDialog';

const styles = {
  input: {
    cursor: 'pointer',
    display: 'block',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '185px',
    opacity: '0',
    zIndex: '10',
  },
  button: {
    marginRight: '8px',
  },
  result: {
    backgroundColor: 'rgb(232, 232, 232)',
    padding: '8px',
    marginTop: '8px',
    display: 'flex',
  },
  processing: {
    justifyContent: 'space-between',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marginRight: {
    marginRight: '8px',
  },
  colorRed: {
    color: red500,
  },
  processed: {
    display: 'block',
  },
  totalProcessed: {
    display: 'flex',
    alignItems: 'center',
    minHeight: '40px',
  },
  processedItem: {
    marginLeft: '32px',
    marginBottom: '8px',
  },
};

const BulkGeoStructure = ({ handlers, fields }) => {

  const hiddenInputOnClick = event => event.target.value = null;

  const confirmFileImport = confirmed => event => {
    handlers.bulkGeoStructureImport('bulkGeoStructureImportFile', confirmed)(event);
  };

  return <React.Fragment>
    <Breadcrumbs>
      <BreadcrumbsLabel route={{ path: '/zones/bulk-geo-structure' }} />
    </Breadcrumbs>

    <div className="row">
      <div className="col-12">
        <h2>
          <FormattedMessage
            id="zones.titles.bulk_geo_structure"
            defaultMessage="Cadastro de Estrutura Geográfica"
            description="Rótulo do título - Cadastro de Estrutura Geográfica"
          />
        </h2>
        <p>
          <FormattedMessage
            id="zones.desc.bulk_geo_structure"
            defaultMessage="Selecione um arquivo .xlsx e confirme para enviar para processamento."
            description="Rótulo da descrição - Cadastro de Estrutura Geográfica"
          />
        </p>
      </div>
    </div>
    {fields.bulkGeoStructureImportFile &&
      fields.bulkGeoStructureImportFile.length === 1 &&
      fields.bulkGeoStructureImportFile[0].name &&
      <FormattedMessage
        id="common.selected_file"
        defaultMessage="Arquivo selecionado: {filename}"
        description="Exibe o nome do arquivo selecionado"
        values={{ filename: fields.bulkGeoStructureImportFile[0].name }}
      />}
    <RaisedButton
      primary
      label={<FormattedMessage
        id="actions.import"
        defaultMessage="Importar"
        description="Rótulo de ação - Importar"
      />}
      style={styles.button}
    >
      <input
        style={styles.input}
        id="import"
        type="file"
        accept=".xlsx"
        onChange={handlers.changeFile('bulkGeoStructureImportFile')}
        onClick={hiddenInputOnClick}
      />
    </RaisedButton>

    <RaisedButton
      onClick={handlers.bulkGeoStructureTemplateDownload}
      label={<FormattedMessage
        id="actions.geo_structures_template_download"
        defaultMessage="Baixar Template"
        description="Rótulo de ação - Baixar Template"
      />}
      style={styles.button}
    />

    <RaisedButton
      onClick={handlers.bulkGeoStructureExport}
      label={<FormattedMessage
        id="actions.geo_structures_export"
        defaultMessage="Exportar Endereços"
        description="Rótulo de ação - Exportar Endereços"
      />}
      style={{ ...styles.button, float: 'right' }}
    />

    {fields.bulkGeoStructuresResult &&
      <React.Fragment>
        {fields.bulkGeoStructuresResult.pending &&
          <Paper style={{ ...styles.result, ...styles.processing }} zDepth={0}>
            <div style={styles.loading}>
              <CircularProgress style={styles.marginRight} size={30} className="pull-left" />
              <FormattedMessage
                id="actions.bulk_geo_structures_processing"
                defaultMessage="Processando envio, aguarde..."
                description="Rótulo de ação - Processando envio, aguarde..."
              />
            </div>
            <div className="pull-right">
              <FlatButton
                onClick={handlers.bulkGeoStructureCancel}
                label={<FormattedMessage
                  id="actions.bulk_geo_structures_cancel"
                  defaultMessage="Interromper Processo"
                  description="Rótulo de ação - Interromper Processo"
                />}
                style={styles.button}
              />
            </div>
          </Paper>}

        {fields.bulkGeoStructuresResult.cancel &&
          <Paper style={styles.result} zDepth={0}>
            <FormattedMessage
              id="actions.geo_structures_bulk_canceled_action"
              defaultMessage="Processo Cancelado"
              description="Rótulo de mensagem - processo cancelado"
            />
          </Paper>}

        {fields.bulkGeoStructuresResult.processed > 0 &&
          <Paper style={{ ...styles.result, ...styles.processed }} zDepth={0}>
            <div style={styles.totalProcessed}>
              <CheckIcon style={styles.marginRight} color={blue500} />
              <strong>{fields.bulkGeoStructuresResult.processed}100</strong>
              <FormattedMessage
                id="widgets.bulk_geo_structures_processed"
                defaultMessage="Endereços processados com sucesso."
                description="Texto do widget - Endereços processados com sucesso."
              />
            </div>
            {fields.bulkGeoStructuresResult.created > 0 &&
              <div style={styles.processedItem}>
                <strong>{fields.bulkGeoStructuresResult.created}25</strong>
                <FormattedMessage
                  id="widgets.bulk_geo_structures_added"
                  defaultMessage="Endereços incluídos."
                  description="Texto do widget - Endereços incluídos."
                />
              </div>}
            {fields.bulkGeoStructuresResult.updated > 0 &&
              <div style={styles.processedItem}>
                <strong>{fields.bulkGeoStructuresResult.updated}30</strong>
                <FormattedMessage
                  id="widgets.bulk_geo_structures_updated"
                  defaultMessage="Endereços alterados."
                  description="Texto do widget - Endereços alterados."
                />
              </div>}
            {fields.bulkGeoStructuresResult.deleted > 0 &&
              <div style={styles.processedItem}>
                <strong>{fields.bulkGeoStructuresResult.deleted}25</strong>
                <FormattedMessage
                  id="widgets.bulk_geo_structures_removed"
                  defaultMessage="Endereços removidos."
                  description="Texto do widget - Endereços removidos."
                />
              </div>}
          </Paper>}

        {fields.bulkGeoStructuresResult.failed > 0 &&
          <Paper style={{ ...styles.result, ...styles.colorRed }} zDepth={0}>
            <InfoIcon style={styles.marginRight} color={red500} />
            <strong>{fields.bulkGeoStructuresResult.failed}20</strong>
            <FormattedMessage
              id="widgets.bulk_geo_structures_failed"
              defaultMessage="Endereços com falha no processamento."
              description="Texto do widget - Endereços com falha no processamento."
            />
          </Paper>}
      </React.Fragment>}

    {fields.bulkGeoStructureImportFile &&
      fields.bulkGeoStructureImportFile.length === 1 && fields.bulkGeoStructureImportFile[0].name &&
      <ConfirmationDialog
        message={
          <FormattedMessage
            id="modal.bulk_geo_structure.confirm"
            defaultMessage="O arquivo: {filename} será enviado para processamento. Deseja continuar?"
            description="Mensagem de confirmação ao importar o arquivo."
            values={{ filename: fields.bulkGeoStructureImportFile[0].name }}
          />
        }
        open={true}
        onRequestClose={confirmFileImport(false)}
        onConfirmation={confirmFileImport(true)}
      />}
  </React.Fragment>;
};

BulkGeoStructure.propTypes = {
  handlers: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  lists: PropTypes.object.isRequired,
};

BulkGeoStructure.defaultProps = {};

export default BulkGeoStructure;
