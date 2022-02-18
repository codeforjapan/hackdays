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
  useControllableState,
  useEditableControls,
} from '@chakra-ui/react';
import { NextServer } from 'next/dist/server/next';
import { nextTick } from 'process';
import { KeyboardEventHandler, memo, useEffect, useState, VFC } from 'react';

export type onUpdatePropFunction = (property: string, nextvalue: string) => Promise<void>;

type Props = {
  label: string;
  property: string;
  defaultValue: string | null | undefined;
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

export const EditableProperty: VFC<Props> = function foo(props: Props) {
  const { label, property, defaultValue, onUpdateProp, editable = false, disabled = false, loading = false } = props;
  const [value, setValue] = useState('');
  const [typing, setTyping] = useState(false);
  const [msg, setErrorMessage] = useState('');
  function canceled(previousValue: string) {
    setValue(defaultValue ? defaultValue : '');
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
    setValue(defaultValue ? defaultValue : '');
  }, [defaultValue]);

  return (
    <Box>
      <Heading as='h2'>{label}</Heading>
      <Text color='red.300'>{msg}</Text>
      {editable ? (
        <Editable
          value={value}
          isPreviewFocusable={false}
          onCancel={(pv: string) => {
            canceled(pv);
          }}
          onSubmit={(v: string) => {
            submit(v);
          }}
          onChange={(t: string) => {
            setValue(t);
          }}
          submitOnBlur={false}
        >
          <EditablePreview />
          <EditableInput
            onCompositionStart={() => setTyping(true)}
            onCompositionEnd={() => setTyping(false)}
            onKeyDown={(e) => {
              // disable Enter key during using IME
              if (e.key == 'Enter' && typing) {
                e.preventDefault();
              }
            }}
          />
          <EditableControls ariaLabel={label} />
        </Editable>
      ) : (
        <Text fontSize='md'>{value}</Text>
      )}
    </Box>
  );
};
