import { Text } from '@/components/Text';
import { darkColors, lightColors } from '@/theme/tokens';
import { textStyles } from '@/theme/typography';
import { flattenStyle as flatten, renderWithTheme } from '@/test/render';

describe('Text', () => {
  it('disables font scaling so the designed layout holds', async () => {
    const { getByText } = await renderWithTheme(<Text>Send money</Text>);
    expect(getByText('Send money').props.allowFontScaling).toBe(false);
  });

  it('applies the full type role, not just a size', async () => {
    const { getByText } = await renderWithTheme(<Text variant="screenTitle">Activity</Text>);
    const style = flatten(getByText('Activity').props.style);

    expect(style.fontFamily).toBe(textStyles.screenTitle.fontFamily);
    expect(style.fontSize).toBe(textStyles.screenTitle.fontSize);
    expect(style.lineHeight).toBe(textStyles.screenTitle.lineHeight);
    expect(style.letterSpacing).toBe(textStyles.screenTitle.letterSpacing);
  });

  it('gives money roles tabular figures so amounts do not shift', async () => {
    const { getByText } = await renderWithTheme(<Text variant="money">₦200,000</Text>);
    expect(flatten(getByText('₦200,000').props.style).fontVariant).toEqual(['tabular-nums']);
  });

  it('does not give tabular figures to prose', async () => {
    const { getByText } = await renderWithTheme(<Text variant="body">Choose a destination</Text>);
    expect(flatten(getByText('Choose a destination').props.style).fontVariant).toBeUndefined();
  });

  it('resolves tone against the light theme', async () => {
    const { getByText } = await renderWithTheme(<Text tone="muted">Across 5 wallets</Text>, {
      theme: 'light',
    });
    expect(flatten(getByText('Across 5 wallets').props.style).color).toBe(
      lightColors.text.muted
    );
  });

  it('resolves the same tone differently in dark', async () => {
    const { getByText } = await renderWithTheme(<Text tone="muted">Across 5 wallets</Text>, {
      theme: 'dark',
    });
    expect(flatten(getByText('Across 5 wallets').props.style).color).toBe(
      darkColors.text.muted
    );
  });

  it('lets a caller override style without losing the role', async () => {
    const { getByText } = await renderWithTheme(
      <Text variant="label" style={{ marginTop: 12 }}>
        Recent
      </Text>
    );
    const style = flatten(getByText('Recent').props.style);
    expect(style.marginTop).toBe(12);
    expect(style.fontSize).toBe(textStyles.label.fontSize);
  });
});
