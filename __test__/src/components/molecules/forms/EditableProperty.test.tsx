import { mount, shallow } from 'enzyme';
import { EditableProperty } from '../../../../../src/components/molecules/forms/EditableProperty';
import { isVisible } from '../../../../util';
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
describe('PrimaryButton', () => {
  it('render non-editable value', () => {
    const mockCallback = jest.fn();
    const prop = shallow(
      <EditableProperty label='myLabel' property='myprop' defaultValue='default' onUpdateProp={mockCallback} />,
    );
    expect(prop.find('Heading').text()).toEqual('myLabel');
    expect(prop.find('Text.value').text()).toEqual('default');
  });
  it('click to edit for editable value', () => {
    const mockCallback = jest.fn();
    const prop = mount(
      <EditableProperty
        label='myLabel'
        property='myprop'
        defaultValue='default'
        onUpdateProp={mockCallback}
        editable={true}
      />,
    );
    expect(isVisible(prop.find('input').getDOMNode())).toEqual(false);
    prop.find('button').simulate('click');
    expect(isVisible(prop.find('input').getDOMNode())).toEqual(true);
  });
  it('the data should be editable', async () => {
    const mockCallback = jest.fn().mockResolvedValue(true);
    const prop = mount(
      <EditableProperty
        label='myLabel'
        property='myprop'
        defaultValue='default'
        onUpdateProp={mockCallback}
        editable={true}
      />,
    );
    prop.find('button').simulate('click'); // edit
    expect(prop.find('EditablePreview').text()).toEqual('default');
    prop.find('input').simulate('change', { target: { value: 'New Text' } }); // enter text
    expect(prop.find('input').props()['value']).toEqual('New Text'); // text should be changed
    prop.find('button.commit').simulate('click'); // click commit
    expect(mockCallback.call.length).toBe(1); // the mock function should be called
    expect(mockCallback).toHaveBeenCalledWith('myprop', 'New Text'); // with correct parameters
    expect(prop.find('EditablePreview').text()).toEqual('New Text'); // the displaying text should be chaned
  });
  it('the data should be cancellable', () => {
    const mockCallback = jest.fn();
    const prop = mount(
      <EditableProperty
        label='myLabel'
        property='myprop'
        defaultValue='default'
        onUpdateProp={mockCallback}
        editable={true}
      />,
    );

    prop.find('button').simulate('click'); // edit
    prop.find('input').simulate('change', { target: { value: 'New Text' } });
    expect(prop.find('input').props()['value']).toEqual('New Text');
    prop.find('button.cancel').simulate('click');
    expect(prop.find('input').props()['value']).toEqual('default');
  });

  test('show error message when update is failed', async () => {
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
    userEvent.click(screen.getByLabelText('myprop-edit'));
    userEvent.type(screen.getByRole('textbox'), 'new bad text');
    userEvent.click(screen.getByLabelText('myprop-commit'));
    await waitFor(() => {
      expect(screen.getByLabelText('error-message').textContent).toEqual('error text');
    });
  });
});
