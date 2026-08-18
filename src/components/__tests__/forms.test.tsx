import { AmountField } from '@/components/forms/AmountField';
import { AmountHero } from '@/components/forms/AmountHero';
import { ChipGroup } from '@/components/forms/ChipGroup';
import { Input } from '@/components/forms/Input';
import { Keypad } from '@/components/forms/Keypad';
import { OtpField } from '@/components/forms/OtpField';
import { Toggle } from '@/components/forms/Toggle';
import { ToggleRow } from '@/components/forms/ToggleRow';
import { lightColors } from '@/theme/tokens';
import { textStyles } from '@/theme/typography';
import { flattenStyle, fireEvent, renderWithTheme, waitFor } from '@/test/render';

describe('Input', () => {
  it('shows a helper line', async () => {
    const { getByText } = await renderWithTheme(
      <Input label="Meter number" helper="Found on your last receipt" />
    );
    expect(getByText('Found on your last receipt')).toBeTruthy();
  });

  it('replaces the helper with the error and reddens the border', async () => {
    const { getByText, queryByText, getByTestId } = await renderWithTheme(
      <Input label="Amount" helper="Up to £5,000" error="Not enough in your GBP wallet" testID="f" />
    );

    expect(getByText('Not enough in your GBP wallet')).toBeTruthy();
    expect(queryByText('Up to £5,000')).toBeNull();
    expect(flattenStyle(getByText('Not enough in your GBP wallet').props.style).color).toBe(
      lightColors.status.danger
    );
    expect(getByTestId('f')).toBeTruthy();
  });

  it('draws the focus halo as a real ring, since RN has no spread shadow', async () => {
    const { getByTestId, queryByTestId } = await renderWithTheme(
      <Input label="Search" testID="f" />
    );

    expect(queryByTestId('f-focus-ring')).toBeNull();

    fireEvent(getByTestId('f'), 'focus');
    await waitFor(() => expect(getByTestId('f-focus-ring')).toBeTruthy());
  });

  it('does not show the halo while invalid — the red border carries it', async () => {
    const { getByTestId, queryByTestId } = await renderWithTheme(
      <Input label="Amount" error="Too much" testID="f" />
    );

    fireEvent(getByTestId('f'), 'focus');
    await waitFor(() => expect(getByTestId('f')).toBeTruthy());
    expect(queryByTestId('f-focus-ring')).toBeNull();
  });

  it('never scales text with the OS setting', async () => {
    const { getByTestId } = await renderWithTheme(<Input testID="f" />);
    expect(getByTestId('f').props.allowFontScaling).toBe(false);
  });
});

describe('Keypad', () => {
  it('omits the decimal key when the pad is for codes', async () => {
    const { queryByTestId } = await renderWithTheme(<Keypad decimal={false} />);
    expect(queryByTestId('key-.')).toBeNull();
  });

  it('offers the decimal key on an amount pad', async () => {
    const { getByTestId } = await renderWithTheme(<Keypad />);
    expect(getByTestId('key-.')).toBeTruthy();
  });

  it('reports the pressed digit', async () => {
    const onKey = jest.fn();
    const { getByTestId } = await renderWithTheme(<Keypad onKey={onKey} />);

    fireEvent.press(getByTestId('key-7'));
    expect(onKey).toHaveBeenCalledWith('7');
  });

  it('reports deletions and labels the key for screen readers', async () => {
    const onKey = jest.fn();
    const { getByTestId, getByLabelText } = await renderWithTheme(<Keypad onKey={onKey} />);

    expect(getByLabelText('Delete')).toBeTruthy();
    fireEvent.press(getByTestId('key-back'));
    expect(onKey).toHaveBeenCalledWith('back');
  });
});

describe('OtpField', () => {
  it('renders one box per digit', async () => {
    const { getByTestId, queryByTestId } = await renderWithTheme(<OtpField length={6} />);

    expect(getByTestId('otp-box-5')).toBeTruthy();
    expect(queryByTestId('otp-box-6')).toBeNull();
  });

  it('marks the next empty box with the brand border', async () => {
    const { getByTestId } = await renderWithTheme(<OtpField value="471" length={6} />);

    expect(flattenStyle(getByTestId('otp-box-3').props.style).borderColor).toBe(
      lightColors.border.brand
    );
    expect(flattenStyle(getByTestId('otp-box-0').props.style).borderColor).toBe(
      lightColors.border.default
    );
  });

  it('shows dots rather than boxes for a PIN', async () => {
    const { getByTestId, queryByTestId } = await renderWithTheme(
      <OtpField value="12" length={4} mask />
    );

    expect(getByTestId('pin-dot-0')).toBeTruthy();
    expect(queryByTestId('otp-box-0')).toBeNull();
    expect(flattenStyle(getByTestId('pin-dot-0').props.style).backgroundColor).toBe(
      lightColors.brand.default
    );
    expect(flattenStyle(getByTestId('pin-dot-3').props.style).backgroundColor).toBe(
      lightColors.control.trackOff
    );
  });

  it('never reveals more characters than its length', async () => {
    const { queryByText } = await renderWithTheme(<OtpField value="1234567890" length={4} />);
    expect(queryByText('5')).toBeNull();
  });
});

describe('Toggle', () => {
  it('reports its state to assistive tech', async () => {
    const { getByRole } = await renderWithTheme(<Toggle checked label="Face ID unlock" />);
    expect(getByRole('switch').props.accessibilityState.checked).toBe(true);
  });

  it('emits the inverted value', async () => {
    const onChange = jest.fn();
    const { getByRole } = await renderWithTheme(
      <Toggle checked={false} onChange={onChange} label="Dark mode" />
    );

    fireEvent.press(getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('fills with brand when on and the off-track colour when off', async () => {
    const { getByRole: on } = await renderWithTheme(<Toggle checked label="On" />);
    expect(flattenStyle(on('switch').props.style).backgroundColor).toBe(
      lightColors.brand.default
    );

    const { getByRole: off } = await renderWithTheme(<Toggle label="Off" />);
    expect(flattenStyle(off('switch').props.style).backgroundColor).toBe(
      lightColors.control.trackOff
    );
  });
});

describe('ToggleRow', () => {
  it('shows title, detail and the switch together', async () => {
    const { getByText, getByRole } = await renderWithTheme(
      <ToggleRow title="Weekly rate summary" detail="One message every Sunday. No noise." />
    );

    expect(getByText('Weekly rate summary')).toBeTruthy();
    expect(getByText('One message every Sunday. No noise.')).toBeTruthy();
    expect(getByRole('switch')).toBeTruthy();
  });

  it('names the switch after the row', async () => {
    const { getByLabelText } = await renderWithTheme(<ToggleRow title="Face ID unlock" />);
    expect(getByLabelText('Face ID unlock')).toBeTruthy();
  });
});

describe('ChipGroup', () => {
  it('selects a chip', async () => {
    const onChange = jest.fn();
    const { getByTestId } = await renderWithTheme(
      <ChipGroup options={['All', 'Sent', 'Received']} value="All" onChange={onChange} />
    );

    fireEvent.press(getByTestId('chip-Sent'));
    expect(onChange).toHaveBeenCalledWith('Sent');
  });

  it('clears a brand chip when it is tapped again — the selection is an input', async () => {
    const onChange = jest.fn();
    const { getByTestId } = await renderWithTheme(
      <ChipGroup tone="brand" options={['50', '100']} value="100" onChange={onChange} />
    );

    fireEvent.press(getByTestId('chip-100'));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('keeps an ink filter selected when tapped again — a view always has one', async () => {
    const onChange = jest.fn();
    const { getByTestId } = await renderWithTheme(
      <ChipGroup tone="ink" options={['All', 'Bills']} value="All" onChange={onChange} />
    );

    fireEvent.press(getByTestId('chip-All'));
    expect(onChange).toHaveBeenCalledWith('All');
  });

  it('fills a selected ink chip with the ink surface', async () => {
    const { getByTestId } = await renderWithTheme(
      <ChipGroup tone="ink" options={['All']} value="All" />
    );
    expect(flattenStyle(getByTestId('chip-All').props.style).backgroundColor).toBe(
      lightColors.surface.ink
    );
  });

  it('tints a selected brand chip and outlines it', async () => {
    const { getByTestId } = await renderWithTheme(
      <ChipGroup tone="brand" options={['200']} value="200" />
    );
    const style = flattenStyle(getByTestId('chip-200').props.style);

    expect(style.backgroundColor).toBe(lightColors.brand.soft);
    expect(style.borderColor).toBe(lightColors.border.brand);
  });

  it('accepts labelled options whose key differs from the label', async () => {
    const { getByText, getByTestId } = await renderWithTheme(
      <ChipGroup options={[{ key: 'power', label: 'Electricity' }]} value="power" />
    );

    expect(getByText('Electricity')).toBeTruthy();
    expect(getByTestId('chip-power')).toBeTruthy();
  });
});

describe('AmountHero', () => {
  it('reddens the figure when it exceeds the balance', async () => {
    const { getByTestId } = await renderWithTheme(
      <AmountHero amount="900" state="over" helper="More than your GBP balance" testID="hero" />
    );
    expect(flattenStyle(getByTestId('hero-figure').props.style).color).toBe(
      lightColors.status.danger
    );
  });

  it('reddens the helper too, so the pair reads as one message', async () => {
    const { getByText } = await renderWithTheme(
      <AmountHero amount="900" state="over" helper="More than your GBP balance" />
    );
    expect(flattenStyle(getByText('More than your GBP balance').props.style).color).toBe(
      lightColors.status.danger
    );
  });

  it('keeps the figure in ink by default', async () => {
    const { getByTestId } = await renderWithTheme(<AmountHero amount="200" testID="hero" />);
    expect(flattenStyle(getByTestId('hero-figure').props.style).color).toBe(
      lightColors.text.strong
    );
  });

  it('gives the figure tabular digits so it does not shift as it is typed', async () => {
    const { getByTestId } = await renderWithTheme(<AmountHero amount="200" testID="hero" />);
    expect(flattenStyle(getByTestId('hero-figure').props.style).fontVariant).toEqual([
      'tabular-nums',
    ]);
  });
});

describe('AmountField', () => {
  it('steps the figure down rather than truncating a long amount', async () => {
    const { getByTestId: short } = await renderWithTheme(
      <AmountField amount="200" editable={false} testID="a" />
    );
    const { getByTestId: long } = await renderWithTheme(
      <AmountField amount="1,667,797.42" editable={false} testID="a" />
    );

    const shortSize = flattenStyle(short('a-figure').props.style).fontSize;
    const longSize = flattenStyle(long('a-figure').props.style).fontSize;

    expect(shortSize).toBe(textStyles.amountFieldXl.fontSize);
    expect(longSize).toBe(textStyles.amountFieldSm.fontSize);
    expect(longSize as number).toBeLessThan(shortSize as number);
  });

  it('opens the currency picker when one is available', async () => {
    const onCurrencyPress = jest.fn();
    const { getByTestId } = await renderWithTheme(
      <AmountField currency="GBP" onCurrencyPress={onCurrencyPress} testID="a" />
    );

    fireEvent.press(getByTestId('a-currency'));
    expect(onCurrencyPress).toHaveBeenCalledTimes(1);
  });

  it('shows the balance alongside the label', async () => {
    const { getByText } = await renderWithTheme(
      <AmountField label="From" balance="£840.20" testID="a" />
    );
    expect(getByText('Balance £840.20')).toBeTruthy();
  });

  it('tints the brand tone to separate it from its pair', async () => {
    const { getByTestId } = await renderWithTheme(<AmountField tone="brand" testID="a" />);
    expect(flattenStyle(getByTestId('a').props.style).backgroundColor).toBe(
      lightColors.brand.soft
    );
  });
});
