import { mount, shallow } from 'enzyme';
import { EditableProperty, onUpdatePropFunction } from '../../../src/molecules/forms/EditableProperty';
import { isVisible } from '../../util';

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
    const mockCallback: onUpdatePropFunction = jest.fn().mockResolvedValue(true);
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
  it('show error message when update is failed', async () => {
    const mockCallback: onUpdatePropFunction = jest.fn().mockRejectedValue('error text');
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
    prop.find('button.commit').simulate('click');
    expect(prop.find('input').props()['value']).toEqual('New Text');
    expect(mockCallback.call.length).toBe(1);
    expect(mockCallback).toHaveBeenCalledWith('myprop', 'New Text');
  });
});
