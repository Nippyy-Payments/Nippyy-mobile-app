import { JourneyStrip } from '@/components/feedback/JourneyStrip';
import { ProgressTrack } from '@/components/feedback/ProgressTrack';
import { SuccessBurst } from '@/components/feedback/SuccessBurst';
import { lightColors } from '@/theme/tokens';
import { flattenStyle, renderWithTheme } from '@/test/render';

describe('ProgressTrack — segmented', () => {
  it('marks completed steps green, the current step amber, the rest as track', async () => {
    const { getByTestId } = await renderWithTheme(
      <ProgressTrack variant="segmented" value={2} total={4} />
    );

    expect(flattenStyle(getByTestId('segment-0').props.style).backgroundColor).toBe(
      lightColors.status.success
    );
    expect(flattenStyle(getByTestId('segment-2').props.style).backgroundColor).toBe(
      lightColors.indicator.pending
    );
    expect(flattenStyle(getByTestId('segment-3').props.style).backgroundColor).toBe(
      lightColors.indicator.track
    );
  });

  it('turns entirely green once every step is done', async () => {
    // This falls out of the step colours rather than a completion branch —
    // see PORTING_PLAN.md §7.4.
    const { getByTestId } = await renderWithTheme(
      <ProgressTrack variant="segmented" value={4} total={4} />
    );

    for (const index of [0, 1, 2, 3]) {
      expect(flattenStyle(getByTestId(`segment-${index}`).props.style).backgroundColor).toBe(
        lightColors.status.success
      );
    }
  });

  it('renders one segment per step', async () => {
    const { getByTestId, queryByTestId } = await renderWithTheme(
      <ProgressTrack variant="segmented" value={1} total={3} />
    );

    expect(getByTestId('segment-2')).toBeTruthy();
    expect(queryByTestId('segment-3')).toBeNull();
  });

  it('reports progress to assistive tech', async () => {
    const { getByTestId } = await renderWithTheme(
      <ProgressTrack variant="segmented" value={2} total={4} testID="bar" />
    );
    const bar = getByTestId('bar');

    expect(bar.props.accessibilityRole).toBe('progressbar');
    expect(bar.props.accessibilityValue).toEqual({ min: 0, max: 4, now: 2 });
  });
});

describe('ProgressTrack — continuous', () => {
  it('fills amber while steps are outstanding', async () => {
    const { getByTestId } = await renderWithTheme(
      <ProgressTrack value={1} total={2} testID="bar" />
    );
    expect(flattenStyle(getByTestId('bar-fill').props.style).backgroundColor).toBe(
      lightColors.indicator.pending
    );
  });

  it('turns green once complete — a brand-coloured bar would say nothing', async () => {
    const { getByTestId } = await renderWithTheme(
      <ProgressTrack value={2} total={2} testID="bar" />
    );
    expect(flattenStyle(getByTestId('bar-fill').props.style).backgroundColor).toBe(
      lightColors.indicator.success
    );
  });
});

describe('JourneyStrip', () => {
  const steps = [
    { label: 'You pay', state: 'done' as const },
    { label: 'We convert', state: 'active' as const },
    { label: 'They receive', state: 'todo' as const },
  ];

  it('renders every step horizontally', async () => {
    const { getByText } = await renderWithTheme(<JourneyStrip steps={steps} />);

    for (const step of steps) expect(getByText(step.label)).toBeTruthy();
  });

  it('colours nodes by state', async () => {
    const { getByTestId } = await renderWithTheme(<JourneyStrip steps={steps} />);

    expect(flattenStyle(getByTestId('journey-node-0').props.style).backgroundColor).toBe(
      lightColors.status.success
    );
    expect(flattenStyle(getByTestId('journey-node-1').props.style).backgroundColor).toBe(
      lightColors.brand.default
    );
    expect(flattenStyle(getByTestId('journey-node-2').props.style).backgroundColor).toBe(
      lightColors.indicator.track
    );
  });

  it('mutes the label of a step not yet reached', async () => {
    const { getByText } = await renderWithTheme(<JourneyStrip steps={steps} />);

    expect(flattenStyle(getByText('They receive').props.style).color).toBe(
      lightColors.text.subtle
    );
    expect(flattenStyle(getByText('You pay').props.style).color).toBe(lightColors.text.body);
  });

  it('sits on a quiet fill when compact', async () => {
    const { getByTestId } = await renderWithTheme(
      <JourneyStrip steps={steps} compact testID="strip" />
    );
    expect(flattenStyle(getByTestId('strip').props.style).backgroundColor).toBe(
      lightColors.surface.quiet
    );
  });

  it('shows step details in the vertical form', async () => {
    const { getByText } = await renderWithTheme(
      <JourneyStrip
        orientation="vertical"
        steps={[
          { label: 'Payment authorised', detail: 'Face ID confirmed', state: 'done' },
          { label: 'Converted to NGN', detail: 'at 1,985 per £1', state: 'active' },
        ]}
      />
    );

    expect(getByText('Face ID confirmed')).toBeTruthy();
    expect(getByText('at 1,985 per £1')).toBeTruthy();
  });

  it('advances the vertical rail as steps complete', async () => {
    const four = [
      { label: 'a', state: 'done' as const },
      { label: 'b', state: 'done' as const },
      { label: 'c', state: 'active' as const },
      { label: 'd', state: 'todo' as const },
    ];

    const { getByTestId } = await renderWithTheme(
      <JourneyStrip orientation="vertical" steps={four} testID="strip" />
    );

    // Two of three gaps covered.
    expect(flattenStyle(getByTestId('strip-rail').props.style).height).toBe(
      `${(2 / 3) * 100}%`
    );
  });
});

describe('SuccessBurst', () => {
  it('renders the celebratory mark with an accessible name', async () => {
    const { getByLabelText } = await renderWithTheme(<SuccessBurst />);
    expect(getByLabelText('Success')).toBeTruthy();
  });

  it('sizes from the token by default', async () => {
    const { getByTestId } = await renderWithTheme(<SuccessBurst testID="burst" />);
    expect(flattenStyle(getByTestId('burst').props.style).width).toBe(104);
  });

  it('honours an explicit size', async () => {
    const { getByTestId } = await renderWithTheme(<SuccessBurst size={64} testID="burst" />);
    expect(flattenStyle(getByTestId('burst').props.style).width).toBe(64);
  });
});
