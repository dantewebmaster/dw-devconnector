import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AutoComplete from 'Components/AutoComplete';

const AssociateStructureForm = ({ handlers, fields, lists }) => {
  const resetInput = () => fields.resetFields;

  return (
    <React.Fragment>
      <Typography style={{ marginTop: 15 }} variant="caption">Tipo</Typography>
      <AutoComplete
        field="searchStructureLevelId"
        value="structureLevelId"
        label="structureLevelName"
        onChangeHandler={handlers.setField}
        options={lists.structureLevels}
        onInputChangeHandler={handlers.setField}
        clearInput={resetInput()}
      />
      <Typography variant="caption">Estrutura</Typography>
      <AutoComplete
        field="searchStructureCode"
        value="structureCode"
        label="structureName"
        options={lists.searchStructures}
        onChangeHandler={handlers.setField}
        onInputChangeHandler={handlers.setField}
        disabledInput={!fields.searchStructureLevelId}
        clearInput={resetInput() || !fields.searchStructureLevelId}
      />
      <Button
        variant="contained"
        size="large"
        color="primary"
        onClick={handlers.assignUnassign}
        disabled={!fields.searchStructureCode || !fields.searchStructureLevelId}
        style={{ margin: '0 auto', display: 'block' }}
      >
        <FormattedMessage
          id="common.confirm"
          defaultMessage="Confirmar"
          description="Rótulo comum - Confirmar"
        />
      </Button>
    </React.Fragment>
  );
};

AssociateStructureForm.propTypes = {
  fields: PropTypes.object.isRequired,
  lists: PropTypes.object.isRequired,
  handlers: PropTypes.object,
  dialogOpen: PropTypes.bool,
};

export default AssociateStructureForm;
