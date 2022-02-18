import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  IconButton,
  Text,
  useEditableControls,
} from '@chakra-ui/react';
import { NextServer } from 'next/dist/server/next';
import { nextTick } from 'process';
import { memo, useEffect, useState, VFC } from 'react';

export type onUpdatePropFunction = (property: string, nextvalue: string) => Promise<void>;

type Props = {
  label: string;
  property: string;
  data: string | null | undefined;
  onUpdateProp: onUpdatePropFunction;
  editable?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

function EditableControls({ ariaLabel }: { ariaLabel: string }) {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();
  return isEditing ? (
    <ButtonGroup justifyContent='right' size='sm'>
      <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} aria-label={ariaLabel + '-commit'} />
      <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} aria-label={ariaLabel + '-cancel'} />
    </ButtonGroup>
  ) : (
    <Flex justifyContent='right'>
      <IconButton size='sm' icon={<EditIcon />} {...getEditButtonProps()} aria-label={ariaLabel + '-edit'} />
    </Flex>
  );
}

export const EditableProperty: VFC<Props> = memo(function foo(props: Props) {
  const { label, property, data, onUpdateProp, editable = false, disabled = false, loading = false } = props;
  const [value, setValue] = useState('');
  const [msg, setErrorMessage] = useState('');
  function canceled(previousValue: string) {
    setValue(previousValue);
  }
  function submit(newvalue: string) {
    setErrorMessage('');
    props
      .onUpdateProp(property, newvalue)
      .then()
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }
  useEffect(() => {
    setValue(data ? data : '');
  }, []);

  return (
    <Box>
      <Heading as='h2'>{label}</Heading>
      <Text color='red.300'>{msg}</Text>
      {editable ? (
        <Editable
          defaultValue={value}
          isPreviewFocusable={false}
          onCancel={(pv: string) => {
            canceled(pv);
          }}
          onSubmit={(v: string) => {
            submit(v);
          }}
        >
          <EditablePreview />
          <EditableInput />
          <EditableControls ariaLabel={label} />
        </Editable>
      ) : (
        <Text fontSize='md'>{value}</Text>
      )}
    </Box>
  );
});
