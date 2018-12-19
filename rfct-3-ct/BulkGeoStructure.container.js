import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// ACTIONS
import * as zonesActions from "./actions/zonesActions";
import BulkGeoStructure from "./views/BulkGeoStructure";
import withHandlers from "components/HighOrderComponents/withHandlers";
import Worker from 'worker-loader!../../utils/bulkGeoStructure.worker';
import { defineMessages, intlShape } from "react-intl";

import ExcelJS from 'exceljs/dist/exceljs';
import FileSaver from 'file-saver';

const worker = new Worker();

const messages = defineMessages({
  excelExportError: {
    id: "zones.messages.excel_export.error",
    defaultMessage: "Erro ao tentar exportar",
    description: "Mensagem de erro na exportação",
  },
  excelError: {
    id: "zones.messages.excel.error",
    defaultMessage: "Erro na planilha",
    description: "Mensagem de erro na planilha",
  },
  excelSuccess: {
    id: "zones.messages.excel.success",
    defaultMessage: "Processo de importação finalizado",
    description: "Mensagem de sucesso ao processar planilha",
  },
  regionName: {
    id: "zones.messages.excel.regionName",
    defaultMessage: "Nome da Região",
    description: "Rótulo da coluna - Nome da Região",
  },
  regionCode: {
    id: "zones.messages.excel.regionCode",
    defaultMessage: "Código da Região",
    description: "Rótulo da coluna - Código da Região",
  },
  departmentName: {
    id: "zones.messages.excel.departmentName",
    defaultMessage: "Nome do Departamento",
    description: "Rótulo da coluna - Nome do Departamento",
  },
  departmentCode: {
    id: "zones.messages.excel.departmentCode",
    defaultMessage: "Código do Departamento",
    description: "Rótulo da coluna - Código do Departamento",
  },
  provinceName: {
    id: "zones.messages.excel.provinceName",
    defaultMessage: "Nome da Província",
    description: "Rótulo da coluna - Nome da Província",
  },
  provinceCode: {
    id: "zones.messages.excel.provinceCode",
    defaultMessage: "Código da Província",
    description: "Rótulo da coluna - Código da Província",
  },
  districtName: {
    id: "zones.messages.excel.districtName",
    defaultMessage: "Nome do Distrito",
    description: "Rótulo da coluna - Nome do Distrito",
  },
  districtCode: {
    id: "zones.messages.excel.districtCode",
    defaultMessage: "Código do Distrito",
    description: "Rótulo da coluna - Código do Distrito",
  },
  deleteGeoStructure: {
    id: "zones.messages.excel.deleteGeoStructure",
    defaultMessage: "Excluir Estrutura Geográfica",
    description: "Rótulo da coluna - Excluir Estrutura Geográfica",
  },
  exportFinish: {
    id: "zones.messages.excel.exportFinish",
    defaultMessage: "Exportação Finalizada",
    description: "Mensagem - Exportação Finalizada",
  },
});

class BulkGeoStructureContainer extends Component {

  state = {
    bulkGeoStructureImportFile: null,
    bulkGeoStructureConfirmed: false,
  }

  componentDidMount() {
    this.props.actions.resetFields();
  }

  componentWillUnmount() {
    this.props.actions.resetLists();
  }

  componentDidUpdate(prevProps) {
    const { zones: { fields, lists } } = this.props;
    const { zones: { fields: prevFields } } = prevProps;

    if (fields.exportFinished !== prevFields.exportFinished && fields.exportFinished === true) {
      this.handleExcelExportDownload(lists.exportedGeoStructures)
    }
  }

  handleChangeFile = field => event => this.setState({ [field]: event.target.files });

  handleBulkGeoStructureImport = (field, confirmed) => () => {
    const files = this.state[field];

    if (!confirmed)
      this.setState({ [field]: null });
    else {
      this.props.actions.bulkGeoStructureInit();
      this.handleXlsxRead(files[0]);
      this.setState({ [field]: null });
    }
  };

  handleBulkGeoStructureCancel = () => this.props.actions.bulkGeoStructureCancel();

  handleXlsxRead = file => {
    const { handlers, intl } = this.props;
    const reader = new FileReader();

    reader.onload = e => {
      worker.postMessage(e.target.result);

      worker.onmessage = async event => {
        const { payload } = event.data;
        if (payload) {
          const len = payload.length;
          if (len <= 0) {
            this.props.actions.bulkGeoStructureFinish();
            handlers.showSnackbar(intl.formatMessage(messages['excelError']));
          } else {
            let subset = [];
            for (let index = 0; index < len; index++) {
              if ((this.props.zones.bulkGeoStructuresResult || {}).cancel) {
                break;
              }
              subset.push(payload[index])
              if (index % 100 === 0 || index === len - 1) {
                await this.props.actions.bulkGeoStructure(subset);
                subset = [];
              }
            }
            if (!this.props.zones.bulkGeoStructuresResult.cancel) {
              this.props.actions.bulkGeoStructureFinish();
              handlers.showSnackbar(intl.formatMessage(messages['excelSuccess']));
            }
          }
        }
      };
    };

    reader.readAsArrayBuffer(file);
  };

  handleBulkGeoStructureExport = () => {
    const { actions, handlers, intl } = this.props;
    const config = {
      params: {
        _limit: 5,
        _offset: 0,
      }
    }
    actions.exportGeoStructuresInit();
    actions.exportGeoStructures(config)
      .then((res) => console.log(res))//eslint-disable-line
      .catch(() => {
        actions.exportGeoStructuresFinish();
        handlers.showSnackbar(intl.formatMessage(messages['excelExportError']));
      });
  }

  handleCancelBulkGeoStructureExport = () => this.props.actions.exportGeoStructuresCancel();

  handleExcelExportDownload = (payload) => {
    const { intl } = this.props;

    // file config
    let fileName = payload ? 'estruturas-geograficas.xlsx' : 'estruturas-geograficas-template.xlsx';
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet('Estruturas Geográficas');
    workbook.creator = 'Natura';
    workbook.created = new Date();

    // create header
    worksheet.columns = [
      {
        header: intl.formatMessage(messages['regionName']),
        key: 'regionName',
      },
      {
        header: intl.formatMessage(messages['regionCode']),
        key: 'regionCode',
      },

      {
        header: intl.formatMessage(messages['departmentName']),
        key: 'departmentName',
      },
      {
        header: intl.formatMessage(messages['departmentCode']),
        key: 'departmentCode',
      },

      {
        header: intl.formatMessage(messages['provinceName']),
        key: 'provinceName',
      },
      {
        header: intl.formatMessage(messages['provinceCode']),
        key: 'provinceCode',
      },

      {
        header: intl.formatMessage(messages['districtName']),
        key: 'districtName',
      },
      {
        header: intl.formatMessage(messages['districtCode']),
        key: 'districtCode',
      },

      !payload && { header: intl.formatMessage(messages['deleteGeoStructure']) },
    ];

    if (payload) {
      const rawData = payload.map(item => {
        return {
          "regionName": item.regionName,
          "regionCode": item.regionCode,
          "departmentName": item.departmentName,
          "departmentCode": item.departmentCode,
          "provinceName": item.provinceName,
          "provinceCode": item.provinceCode,
          "districtName": item.districtName,
          "districtCode": item.districtCode,
        };
      });
      rawData.forEach(row => worksheet.addRow(row));
    }

    // styles
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getRow(1).border = {
      top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
    };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "FF0062CC",
      },
    };
    worksheet.eachRow(row => {
      // Iterate over all non-null cells in a row
      row.eachCell((cell, colNumber) => {
        const col = worksheet.getColumn(colNumber);
        if (cell.value && (!col.width || col.width < cell.value.toString().length))
          col.width = cell.value.toString().length * 1.2;
      });
    });

    workbook.xlsx.writeBuffer()
      .then(buffer => {
        FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName);
      })
      .catch(error => { throw error; });
  }

  get handlers() {
    return {
      changeFile: this.handleChangeFile,
      bulkGeoStructureImport: this.handleBulkGeoStructureImport,
      bulkGeoStructureCancel: this.handleBulkGeoStructureCancel,
      xlsxRead: this.handleXlsxRead,
      bulkGeoStructureTemplateDownload: this.handleExcelExportDownload,
      bulkGeoStructureExport: this.handleBulkGeoStructureExport,
      cancelBulkGeoStructureExport: this.handleCancelBulkGeoStructureExport,
    };
  }

  get fields() {
    const {
      bulkGeoStructureImportFile,
      bulkGeoStructureConfirmed,
    } = this.state;

    return {
      bulkGeoStructureImportFile,
      bulkGeoStructureConfirmed,
    };
  }

  render() {
    const { zones: { lists, bulkGeoStructuresResult, fields } } = this.props;

    return <BulkGeoStructure
      fields={{ ...this.fields, bulkGeoStructuresResult, ...fields }}
      lists={lists}
      handlers={this.handlers}
    />;
  }
}

BulkGeoStructureContainer.propTypes = {
  intl: intlShape,
  handlers: PropTypes.object.isRequired,
  zones: PropTypes.object,
  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    zones: state.zones,
    snackbar: state.snackbar,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...zonesActions }, dispatch)
  };
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(withHandlers(BulkGeoStructureContainer));
