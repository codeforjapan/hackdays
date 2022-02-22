import { EditableProperty } from '../../../../../src/components/molecules/forms/EditableProperty';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';

/*label: string;
  property: string;
  defaultValue: string | null | undefined;
  onUpdateProp: onUpdatePropFunction;
  editable?: boolean;
  disabled?: boolean;
  loading?: boolean;
*/
describe('EditableProperty', () => {
  it('renders non-editable value', () => {
    const mockCallback = jest.fn();
    render(<EditableProperty label='myLabel' property='myprop' defaultValue='default' onUpdateProp={mockCallback} />);
    expect(screen.getByRole('heading')).toHaveTextContent('myLabel');
    expect(screen.getByText('default', { selector: '.value' })).toBeInTheDocument();
  });
  it('shows a textbox to edit, after an edit button is clicked', async () => {
    const mockCallback = jest.fn();
    render(
      <EditableProperty
        label='myLabel'
        property='myprop'
        defaultValue='default'
        onUpdateProp={mockCallback}
        editable={true}
      />,
    );
    // A textbox should not be in DOM before staring edit
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    // The aria-label of an edit button should be `${property}-edit`
    await userEvent.click(screen.getByLabelText('myprop-edit'));
    expect(screen.getByRole('textbox')).toBeVisible();
  });
  it('changes the value, after an user edits and saves it', async () => {
    const user = userEvent.setup();
    const mockCallback = jest.fn().mockResolvedValue(true);
    render(
      <EditableProperty
        label='myLabel'
        property='myprop'
        defaultValue='default'
        onUpdateProp={mockCallback}
        editable={true}
      />,
    );
    // 'default' should be shown as preview text
    expect(screen.getByText('default')).toBeInTheDocument();

    // User begins to edit
    await user.click(screen.getByLabelText('myprop-edit'));

    // User deletes existing text and enters new one
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.clear(input);
    await user.keyboard('New Text');
    expect(input).toHaveValue('New Text');

    // User saves the change
    // The aria-label of a save button should be `${property}-commit`
    await userEvent.click(screen.getByLabelText('myprop-commit'));

    // The onUpdateProp handler should be called once
    // with the changed prop name and its new vaue.
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('myprop', 'New Text');

    // 'New Text' should be shown as new preview text
    expect(screen.getByText('New Text')).toBeInTheDocument();
  });
  it('restores the value, after the change is discarded', async () => {
    const user = userEvent.setup();
    const mockCallback = jest.fn();
    render(
      <EditableProperty
        label='myLabel'
        property='myprop'
        defaultValue='default'
        onUpdateProp={mockCallback}
        editable={true}
      />,
    );

    // User begins to edit
    await user.click(screen.getByLabelText('myprop-edit'));

    // User deletes existing text and enters new one
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.clear(input);
    await user.keyboard('New Text');
    expect(input).toHaveValue('New Text');

    // User discards the change
    // The aria-label of a discard button should be `${property}-cancel`
    await userEvent.click(screen.getByLabelText('myprop-cancel'));

    // 'default' should be left as preview text
    expect(screen.getByText('default')).toBeInTheDocument();
    // 'New text' should not be shown because it was discarded
    expect(screen.queryByText('New Text')).not.toBeInTheDocument();
  });

  it('shows error message when fails to update the value', async () => {
    const user = userEvent.setup();
    const mockCallback = jest.fn().mockRejectedValue(new Error('error text'));
    render(
      <EditableProperty
        label='myLabel'
        property='myprop'
        defaultValue='default'
        onUpdateProp={mockCallback}
        editable={true}
      />,
    );
    await user.click(screen.getByLabelText('myprop-edit'));
    await user.type(screen.getByRole('textbox'), 'new bad text');
    await user.click(screen.getByLabelText('myprop-commit'));
    await waitFor(() => {
      expect(screen.getByLabelText('error-message')).toHaveTextContent('error text');
    });
  });
});
