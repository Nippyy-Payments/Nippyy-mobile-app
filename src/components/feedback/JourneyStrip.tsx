import { Fragment } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { PulseRing } from '@/components/feedback/PulseRing';
import { useTokens } from '@/theme/ThemeProvider';

export type JourneyState = 'done' | 'active' | 'todo';

export type JourneyStep = {
  label: string;
  /** Second line, vertical orientation only. */
  detail?: string;
  state: JourneyState;
};

export type JourneyStripProps = {
  steps: JourneyStep[];
  /** Horizontal only: sits on a quiet fill with a rounded corner. */
  compact?: boolean;
  orientation?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const V_GAP = 26;
const V_ROW_GAP = 16;
const V_RAIL_LEFT = 19;
const V_RAIL_INSET = 14;
const V_PAD_LEFT = 6;
const V_CHECK = 16;
const V_CHECK_STROKE = 3;
const V_ACTIVE_DOT = 9;

const H_NODE_GAP = 6;
const H_CHECK = 13;
const H_CHECK_STROKE = 3.2;
const H_ACTIVE_DOT = 7;
const H_ITEM_WIDTH_COMPACT = 56;
const H_ITEM_WIDTH = 64;
const H_CONNECTOR_OFFSET = -18;
const H_PAD_V_COMPACT = 14;
const H_PAD_H_COMPACT = 10;
const H_PAD_V = 4;

/**
 * The progress trail on the review and sending screens: where the money is
 * now and what happens next.
 *
 * Complete steps are green, the live step pulses cyan, the rest are grey.
 * `orientation="vertical"` is the taller form used while a transfer is in
 * flight, where each step carries a second line of detail.
 */
export function JourneyStrip({
  steps,
  compact = false,
  orientation = 'horizontal',
  style,
  testID,
}: JourneyStripProps) {
  const { colors, size, radius, borderWidth } = useTokens();

  if (orientation === 'vertical') {
    const doneCount = steps.filter((step) => step.state === 'done').length;
    const railProgress = steps.length > 1 ? (doneCount / (steps.length - 1)) * 100 : 0;
    const node = size.journeyNode.vertical;

    return (
      <View testID={testID} style={[{ paddingLeft: V_PAD_LEFT }, style]}>
        {/* The rail sits behind the nodes; the brand segment overlays it. */}
        <View
          style={{
            position: 'absolute',
            left: V_RAIL_LEFT,
            top: V_RAIL_INSET,
            bottom: V_RAIL_INSET,
            width: size.journeyConnector.vertical,
            borderRadius: radius.card,
            backgroundColor: colors.border.subtle,
          }}
        />
        <View
          testID={testID ? `${testID}-rail` : undefined}
          style={{
            position: 'absolute',
            left: V_RAIL_LEFT,
            top: V_RAIL_INSET,
            width: size.journeyConnector.vertical,
            height: `${railProgress}%`,
            borderRadius: radius.card,
            backgroundColor: colors.brand.default,
          }}
        />

        <View style={{ rowGap: V_GAP }}>
          {steps.map((step, index) => (
            <View
              key={`${step.label}-${index}`}
              style={{ flexDirection: 'row', alignItems: 'center', columnGap: V_ROW_GAP }}
            >
              {/* The design punches the node through the rail with a 4px ring
                  of page colour, expressed there as a spread shadow. Here it
                  is a real ring — a padded, page-coloured wrapper. */}
              <View
                style={{
                  padding: size.journeyNodeRing,
                  borderRadius: (node + size.journeyNodeRing * 2) / 2,
                  backgroundColor: colors.surface.page,
                  flexShrink: 0,
                }}
              >
                <View
                  testID={`journey-node-${index}`}
                  style={{
                    width: node,
                    height: node,
                    borderRadius: node / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      step.state === 'done'
                        ? colors.brand.default
                        : step.state === 'active'
                          ? colors.surface.quiet
                          : colors.surface.page,
                    borderWidth: step.state === 'done' ? 0 : borderWidth.node,
                    borderColor:
                      step.state === 'active' ? colors.brand.default : colors.border.default,
                  }}
                >
                  <PulseRing size={node} active={step.state === 'active'} />
                  {step.state === 'done' ? (
                    <Icon
                      name="checkMark"
                      size={V_CHECK}
                      strokeWidth={V_CHECK_STROKE}
                      color={colors.text.onBrand}
                    />
                  ) : null}
                  {step.state === 'active' ? (
                    <View
                      style={{
                        width: V_ACTIVE_DOT,
                        height: V_ACTIVE_DOT,
                        borderRadius: V_ACTIVE_DOT / 2,
                        backgroundColor: colors.brand.default,
                      }}
                    />
                  ) : null}
                </View>
              </View>

              <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                  variant="journeyLabel"
                  tone={step.state === 'todo' ? 'subtle' : 'strong'}
                >
                  {step.label}
                </Text>
                {step.detail ? (
                  <Text variant="caption" tone="subtle">
                    {step.detail}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  const node = size.journeyNode.horizontal;

  return (
    <View
      testID={testID}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          paddingVertical: compact ? H_PAD_V_COMPACT : H_PAD_V,
          paddingHorizontal: compact ? H_PAD_H_COMPACT : 0,
          backgroundColor: compact ? colors.surface.quiet : 'transparent',
          borderRadius: compact ? radius.card : 0,
        },
        style,
      ]}
    >
      {steps.map((step, index) => {
        const next = steps[index + 1];
        const nodeColor =
          step.state === 'done'
            ? colors.status.success
            : step.state === 'active'
              ? colors.brand.default
              : colors.indicator.track;
        const glyphColor = step.state === 'todo' ? colors.text.subtle : colors.text.onBrand;

        return (
          <Fragment key={`${step.label}-${index}`}>
            <View
              style={{
                alignItems: 'center',
                rowGap: H_NODE_GAP,
                width: compact ? H_ITEM_WIDTH_COMPACT : H_ITEM_WIDTH,
                flexShrink: 0,
              }}
            >
              <View
                testID={`journey-node-${index}`}
                style={{
                  width: node,
                  height: node,
                  borderRadius: node / 2,
                  backgroundColor: nodeColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PulseRing size={node} active={step.state === 'active'} />
                {step.state === 'done' ? (
                  <Icon
                    name="checkMark"
                    size={H_CHECK}
                    strokeWidth={H_CHECK_STROKE}
                    color={glyphColor}
                  />
                ) : (
                  <View
                    style={{
                      width: H_ACTIVE_DOT,
                      height: H_ACTIVE_DOT,
                      borderRadius: H_ACTIVE_DOT / 2,
                      backgroundColor: glyphColor,
                    }}
                  />
                )}
              </View>

              <Text
                variant="microStrong"
                style={{
                  textAlign: 'center',
                  color: step.state === 'todo' ? colors.text.subtle : colors.text.body,
                }}
              >
                {step.label}
              </Text>
            </View>

            {next ? (
              <View
                style={{
                  flex: 1,
                  height: size.journeyConnector.horizontal,
                  borderRadius: size.journeyConnector.horizontal / 2,
                  marginTop: H_CONNECTOR_OFFSET,
                  backgroundColor:
                    next.state === 'todo' ? colors.border.default : colors.status.success,
                }}
              />
            ) : null}
          </Fragment>
        );
      })}
    </View>
  );
}
