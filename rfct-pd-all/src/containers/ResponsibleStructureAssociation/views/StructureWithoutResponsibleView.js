import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import PersonStructure from 'Components/PersonStructure/PersonStructure';
import ActionDialog from 'Components/ActionDialog';
import AssociateResponsibleForm from './AssociateResponsibleForm';

const StructureWithoutResponsibleView = ({ fields, lists, handlers, dialogOpen }) => {
  return (
    <React.Fragment>
      {lists.structureBulkResult.length > 0 &&
        lists.structureBulkResult.map(item => (
          <PersonStructure
            key={item.structureCode}
            fields={item}
            buttonAction={() => handlers.openDialog(item)}
            buttonLabel={<FormattedMessage
              id="common.assign_responsible"
              defaultMessage="Atribuir Responsável"
              description="Rótulo comum - Atribuir Responsável"
            />}
          />
        ))}
      <ActionDialog
        open={dialogOpen}
        onCancel={handlers.closeDialog}
        title={<FormattedMessage
          id="modal.title.association_responsible"
          defaultMessage="Relacionar responsável a estrutura"
          description="Título do modal - Relacionar responsável a estrutura"
        />}
        customForm={
          <AssociateResponsibleForm fields={fields} lists={lists} handlers={handlers} />
        }
      />
    </React.Fragment>
  );
};

StructureWithoutResponsibleView.propTypes = {
  buttonAction: PropTypes.func,
  fields: PropTypes.object.isRequired,
  lists: PropTypes.object.isRequired,
  handlers: PropTypes.object,
  dialogOpen: PropTypes.bool,
};

export default StructureWithoutResponsibleView;

