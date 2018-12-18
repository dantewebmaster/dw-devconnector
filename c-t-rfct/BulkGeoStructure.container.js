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

  handleBulkGeoStructureTemplateDownload = () => {
    const { intl } = this.props;

    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet('Estruturas Geográficas');
    workbook.creator = 'Natura';
    workbook.created = new Date();

    // create header
    worksheet.columns = [
      { header: intl.formatMessage(messages['regionName']) },
      { header: intl.formatMessage(messages['regionCode']) },

      { header: intl.formatMessage(messages['departmentName']) },
      { header: intl.formatMessage(messages['departmentCode']) },

      { header: intl.formatMessage(messages['provinceName']) },
      { header: intl.formatMessage(messages['provinceCode']) },

      { header: intl.formatMessage(messages['districtName']) },
      { header: intl.formatMessage(messages['districtCode']) },

      { header: intl.formatMessage(messages['deleteGeoStructure']) },
    ];

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

    // Iterate over all rows that have values in a worksheet
    worksheet.eachRow(function(row) {
      // Iterate over all non-null cells in a row
      row.eachCell(function(cell, colNumber) {
        const col = worksheet.getColumn(colNumber);
        if (cell.value && (!col.width || col.width < cell.value.toString().length))
          col.width = cell.value.toString().length * 1.2;
      });
    });

    workbook.xlsx.writeBuffer()
      .then(buffer => {
        FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'estruturas-geograficas-template.xlsx');
      })
      .catch(error => { throw error });
  };

  handleBulkGeoStructureExport = () => {
    let { zones: { exportGeoStructuresResult }, intl, actions, handlers } = this.props;

    const config = {
      params: {
        _limit: 4,
        _offset: 0,
      }
    }

    actions.exportGeoStructuresInit();

    let rawData = [];
    if (
      exportGeoStructuresResult.exportedGeoStructures &&
      exportGeoStructuresResult.exportedGeoStructures.length > 0
    ) {
      rawData = exportGeoStructuresResult.exportedGeoStructures.map(item => {
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
    }

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
    ];

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

    // Iterate over all rows that have values in a worksheet
    worksheet.eachRow(function(row) {
      // Iterate over all non-null cells in a row
      row.eachCell(function(cell, colNumber) {
        const col = worksheet.getColumn(colNumber);
        if (cell.value && (!col.width || col.width < cell.value.toString().length))
          col.width = cell.value.toString().length * 1.2;
      });
    });

    if (rawData.length > 0) {
      if (rawData.length <= 0) {
        actions.exportGeoStructuresFinish();
        handlers.showSnackbar(intl.formatMessage(messages['exportFinish']));
      } else {
        let subset = [];
        for (let index = 0; index < rawData.length; index++) {
          if ((!exportGeoStructuresResult || {}).cancel) {
            break;
          }
          subset.push(rawData[index])
          if (index % 4 === 0 || index === rawData.length - 1) {
            actions.exportGeoStructures(config);
            subset = [];
          }
          worksheet.addRow(rawData[index]);
        }
        if (!exportGeoStructuresResult.cancel) {
          actions.exportGeoStructuresFinish();
          handlers.showSnackbar(intl.formatMessage(messages['exportFinish']));
        }

        workbook.xlsx.writeBuffer()
          .then(buffer => {
            FileSaver.saveAs(
              new Blob([buffer], { type: 'application/octet-stream' }),
              'estruturas-geograficas.xlsx'
            );
          })
          .catch(error => { throw error; });
      }
    }
  };

  get handlers() {
    return {
      changeFile: this.handleChangeFile,
      bulkGeoStructureImport: this.handleBulkGeoStructureImport,
      bulkGeoStructureCancel: this.handleBulkGeoStructureCancel,
      xlsxRead: this.handleXlsxRead,
      bulkGeoStructureTemplateDownload: this.handleBulkGeoStructureTemplateDownload,
      bulkGeoStructureExport: this.handleBulkGeoStructureExport,
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
    const { zones: { lists, bulkGeoStructuresResult } } = this.props;

    return <BulkGeoStructure
      fields={{ ...this.fields, bulkGeoStructuresResult }}
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
