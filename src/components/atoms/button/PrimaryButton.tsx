import { Button } from '@chakra-ui/react';
import { VFC, memo, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
};
export const PrimaryButton: VFC<Props> = memo(function foo(props: Props) {
  const { children, onClick, disabled = false, loading = false } = props;
  return (
    <Button
      bg='teal.400'
      color='white'
      _hover={{ opacity: 0.8 }}
      onClick={onClick}
      isLoading={loading}
      disabled={disabled || loading}
      type={props.type}
    >
      {children}
    </Button>
  );
});
