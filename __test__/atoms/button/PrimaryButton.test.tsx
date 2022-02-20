// setup enzyme
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { shallow } from 'enzyme';
import { PrimaryButton } from '../../../src/components/atoms/button/PrimaryButton';

describe('PrimaryButton', () => {
  it('renders a child', () => {
    // For Jest+RTL demonstration purpose only
    // This test should not be done by us, but by chakra-ui.
    const mockCallback = jest.fn();
    const button = shallow(<PrimaryButton onClick={mockCallback}>Hello</PrimaryButton>);
    button.simulate('click');
    expect(button.text()).toEqual('Hello');
    expect(mockCallback.mock.calls.length).toBe(1);
  });
});
