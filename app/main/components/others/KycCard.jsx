import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { CheckCircle2, Circle, User } from 'lucide-react-native'
import Svg, { Path, Circle as SvgCircle, Defs, LinearGradient, Stop } from 'react-native-svg'
import { useNavigation } from '@react-navigation/native'
import { useUser } from '../../../contexts/UserContext'

const { width: screenWidth } = Dimensions.get('window')

// Subtle background design
const BackgroundDesign = () => (
  <Svg 
    style={StyleSheet.absoluteFillObject} 
    width="100%" 
    height="100%" 
    viewBox="0 0 300 120"
  >
    <Defs>
      <LinearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.05" />
        <Stop offset="100%" stopColor="#A855F7" stopOpacity="0.02" />
      </LinearGradient>
    </Defs>
    
    {/* Subtle geometric shapes */}
    <SvgCircle cx="250" cy="30" r="20" fill="url(#bgGrad)" />
    <SvgCircle cx="280" cy="70" r="15" fill="rgba(139, 92, 246, 0.03)" />
    <SvgCircle cx="260" cy="90" r="10" fill="rgba(139, 92, 246, 0.04)" />
    
    {/* Minimal accent lines */}
    <Path
      d="M220,20 L290,20"
      stroke="rgba(139, 92, 246, 0.1)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M230,100 L290,100"
      stroke="rgba(139, 92, 246, 0.08)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
)

// Progress indicator component
const ProgressIndicator = ({ progress }) => (
  <Svg width="60" height="60" viewBox="0 0 60 60">
    <Defs>
      <LinearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <Stop offset="0%" stopColor="#8B5CF6" />
        <Stop offset="100%" stopColor="#A855F7" />
      </LinearGradient>
    </Defs>
    {/* Background circle */}
    <SvgCircle
      cx="30"
      cy="30"
      r="25"
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="3"
      fill="none"
    />
    {/* Progress circle */}
    <SvgCircle
      cx="30"
      cy="30"
      r="25"
      stroke="url(#progressGrad)"
      strokeWidth="3"
      fill="none"
      strokeDasharray={`${progress * 1.57} ${1.57 - (progress * 1.57)}`}
      strokeDashoffset="0"
      strokeLinecap="round"
      transform="rotate(-90 30 30)"
    />
  </Svg>
)

export default function KycProgressCard() {
  const { profile, loading: profileLoading } = useUser();
  const navigation = useNavigation();
  
  // Calculate responsive sizes
  const cardWidth = screenWidth - 40
  const isSmallScreen = screenWidth < 350
  const isMediumScreen = screenWidth >= 350 && screenWidth < 400
  
  const responsiveStyles = {
    subtitleFontSize: isSmallScreen ? 10 : isMediumScreen ? 11 : 12,
    itemFontSize: isSmallScreen ? 11 : 12,
    padding: isSmallScreen ? 16 : 18,
  }

  // Verification steps configuration
  const verificationSteps = [
    { key: 'phone_verified', label: 'Phone' },
    { key: 'bvn_verified', label: 'BVN' },
    { key: 'address_verified', label: 'Address' },
  ]

  // Calculate progress
  const completedSteps = verificationSteps.filter(step => 
    profile?.[step.key] === true
  ).length
  const totalSteps = verificationSteps.length
  const progressPercentage = (completedSteps / totalSteps) * 100
  const progressDecimal = completedSteps / totalSteps

  const getStatusText = () => {
    if (completedSteps === 0) return 'Start your verification'
    if (completedSteps === totalSteps) return 'Verification complete!'
    return `${completedSteps} of ${totalSteps} completed`
  }

  if (profileLoading) {
    return (
      <View style={[styles.container, { padding: responsiveStyles.padding }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { fontSize: responsiveStyles.subtitleFontSize }]}>
            Loading verification status...
          </Text>
        </View>
      </View>
    )
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={() => navigation.navigate('KycSteps')}
    >
      <View style={[styles.container, { padding: responsiveStyles.padding }]}>
        {/* Background Design */}
        <BackgroundDesign />
        
        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Left Section - Text and Progress Items */}
          <View style={styles.leftSection}>
            <View style={styles.headerSection}>
              <Text 
                style={[
                  styles.titleText, 
                  { fontSize: responsiveStyles.titleFontSize }
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                KYC Verification
              </Text>
              <Text 
                style={[
                  styles.statusText, 
                  { fontSize: responsiveStyles.subtitleFontSize },
                  completedSteps === totalSteps && styles.completeText
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {getStatusText()}
              </Text>
            </View>
            
            {/* Verification Items */}
            <View style={styles.itemsContainer}>
              {verificationSteps.map((step, index) => {
                const isVerified = profile?.[step.key] === true
                return (
                  <View key={step.key} style={styles.verificationItem}>
                    {isVerified ? (
                      <CheckCircle2 
                        color="#8B5CF6" 
                        size={16} 
                        strokeWidth={2}
                      />
                    ) : (
                      <Circle 
                        color="rgba(255,255,255,0.3)" 
                        size={16} 
                        strokeWidth={2}
                      />
                    )}
                    <Text 
                      style={[
                        styles.itemText, 
                        { fontSize: responsiveStyles.itemFontSize },
                        isVerified && styles.verifiedItemText
                      ]}
                    >
                      {step.label}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>
          
          {/* Right Section - Progress Circle */}
          <View style={styles.rightSection}>
            <View style={styles.progressContainer}>
              <ProgressIndicator progress={progressDecimal} />
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressPercentage}>
                  {Math.round(progressPercentage)}%
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Subtle overlay */}
        <View style={styles.overlay} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderRadius: 16,
    minHeight: 120,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
    flex: 1,
  },
  leftSection: {
    flex: 1,
    paddingRight: 16,
  },
  headerSection: {
    marginBottom: 12,
  },
  titleText: {
    fontFamily: "bold",
    color: "#fff",
    lineHeight: 22,
    marginBottom: 4,
  },
  statusText: {
    color: '#888',
    fontFamily: 'semi',
    lineHeight: 16,
  },
  completeText: {
    color: '#8B5CF6',
  },
  itemsContainer: {
    gap: 8,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemText: {
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'regular',
  },
  verifiedItemText: {
    color: 'rgba(255,255,255,0.9)',
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 14,
    fontFamily: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 80,
  },
  loadingText: {
    color: '#888',
    fontFamily: 'regular',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.02)',
    zIndex: 1,
  },
})