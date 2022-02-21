import { shallow } from 'enzyme';
import { PrimaryButton } from '../../../../../src/components/atoms/button/PrimaryButton';

describe('PrimaryButton', () => {
  it('renders a child', () => {
    const mockCallback = jest.fn();
    const button = shallow(<PrimaryButton onClick={mockCallback}>Hello</PrimaryButton>);
    button.simulate('click');
    expect(button.text()).toEqual('Hello');
    expect(mockCallback.mock.calls.length).toBe(1);
  });
});
