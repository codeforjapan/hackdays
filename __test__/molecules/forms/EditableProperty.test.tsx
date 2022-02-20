import { shallow } from 'enzyme';
import { EditableProperty } from '../../../src/molecules/forms/EditableProperty';

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
  it('render editable value', () => {
    const mockCallback = jest.fn();
    const prop = shallow(
      <EditableProperty
        label='myLabel'
        property='myprop'
        defaultValue='default'
        onUpdateProp={mockCallback}
        editable={true}
      />,
    );
    expect(prop.find('Heading').text()).toEqual('myLabel');
    expect(prop.find('Editable')).toHaveLength(1);
    //expect(prop.find('Editable').props().value).toHaveProperty('value');
  });
});
