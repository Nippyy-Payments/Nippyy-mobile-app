import { MoneyText } from '@/components/data/MoneyText';
import { darkColors, lightColors } from '@/theme/tokens';
import { textStyles } from '@/theme/typography';
import { flattenStyle, renderWithTheme } from '@/test/render';

describe('MoneyText', () => {
  it('renders money in tabular figures so columns align', async () => {
    const { getByText } = await renderWithTheme(<MoneyText>200,000</MoneyText>);
    expect(flattenStyle(getByText('200,000').props.style).fontVariant).toEqual(['tabular-nums']);
  });

  it('colours money-in green', async () => {
    const { getByText } = await renderWithTheme(<MoneyText tone="in">+£2,400.00</MoneyText>);
    expect(flattenStyle(getByText('+£2,400.00').props.style).color).toBe(lightColors.money.in);
  });

  it('colours money-out ink, not red — sending is not an error', async () => {
    const { getByText } = await renderWithTheme(<MoneyText tone="out">-₦200,000</MoneyText>);
    const color = flattenStyle(getByText('-₦200,000').props.style).color;

    expect(color).toBe(lightColors.money.out);
    expect(color).not.toBe(lightColors.status.danger);
  });

  it('colours pending amber', async () => {
    const { getByText } = await renderWithTheme(<MoneyText tone="pending">-₵1,500</MoneyText>);
    expect(flattenStyle(getByText('-₵1,500').props.style).color).toBe(lightColors.money.pending);
  });

  it('hides the figure behind bullets when masked', async () => {
    const { queryByText, getByText } = await renderWithTheme(
      <MoneyText masked>3,624,097</MoneyText>
    );

    expect(queryByText('3,624,097')).toBeNull();
    expect(getByText('••••••')).toBeTruthy();
  });

  it('drops the currency symbol when masked', async () => {
    const { queryByText } = await renderWithTheme(
      <MoneyText masked symbol="₦">
        3,624,097
      </MoneyText>
    );
    expect(queryByText('₦')).toBeNull();
  });

  it('mutes a masked figure rather than keeping its tone', async () => {
    const { getByText } = await renderWithTheme(
      <MoneyText tone="in" masked>
        2,400.00
      </MoneyText>
    );
    expect(flattenStyle(getByText('••••••').props.style).color).toBe(lightColors.text.subtle);
  });

  it('scales the currency symbol against the figure size', async () => {
    const { getByText } = await renderWithTheme(
      <MoneyText variant="balanceHero" symbol="₦" symbolRatio={0.62}>
        3,624,097
      </MoneyText>
    );

    const symbol = flattenStyle(getByText('₦').props.style);
    expect(symbol.fontSize).toBeCloseTo(textStyles.balanceHero.fontSize! * 0.62);
    expect(symbol.color).toBe(lightColors.text.subtle);
  });

  it('follows the active theme', async () => {
    const { getByText } = await renderWithTheme(<MoneyText tone="out">-₦200,000</MoneyText>, {
      theme: 'dark',
    });
    expect(flattenStyle(getByText('-₦200,000').props.style).color).toBe(darkColors.money.out);
  });
});
