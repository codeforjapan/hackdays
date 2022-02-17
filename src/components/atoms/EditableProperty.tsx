import { Box, Editable, EditableInput, EditablePreview, Heading, Text } from '@chakra-ui/react';
import { memo, VFC } from 'react';

type Props = {
  label: string;
  property: string;
  data: any;
  onUpdateProp: (key: string, nextvalue: any) => void;
  editable?: boolean;
  disabled?: boolean;
  loading?: boolean;
};
export const EditableProperty: VFC<Props> = memo(function foo(props: Props) {
  const { label, property, data, onUpdateProp, editable = false, disabled = false, loading = false } = props;
  const value = data ? (data[property] ? data[property] : '') : '';
  return (
    <Box>
      <Heading as='h2'>{label}</Heading>
      {editable ? (
        <Editable defaultValue={value} placeholder='purpose of this project'>
          <EditablePreview />
          <EditableInput />
        </Editable>
      ) : (
        <Text fontSize='md'>{value}</Text>
      )}
    </Box>
  );
});
