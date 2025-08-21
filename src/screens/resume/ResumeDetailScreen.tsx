import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Button,
  Chip,
  List,
  Divider,
  ProgressBar,
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/stack';
import { useResume } from '../../contexts/ResumeContext';
import { theme } from '../../types';
import { Resume, ResumeAnalysis } from '../../types';

const { width } = Dimensions.get('window');

const ResumeDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { resumeId } = route.params as { resumeId: string };
  const { getResumeById, currentResume } = useResume();
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    if (resumeId) {
      getResumeById(resumeId);
    }
  }, [resumeId]);

  useEffect(() => {
    if (currentResume && currentResume.id === resumeId) {
      setResume(currentResume);
    }
  }, [currentResume, resumeId]);

  if (!resume) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return theme.colors.primary;
      case 'IN_PROGRESS':
        return theme.colors.secondary;
      case 'FAILED':
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Optimized';
      case 'IN_PROGRESS':
        return 'Processing';
      case 'FAILED':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  const renderAnalysisSection = () => {
    if (!resume.analysisResult) {
      return (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Analysis</Title>
            <Text style={styles.noAnalysisText}>
              Resume analysis is not available yet. Please wait for processing to complete.
            </Text>
          </Card.Content>
        </Card>
      );
    }

    const analysis = resume.analysisResult;
    const sections = Object.entries(analysis.sections);

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Resume Analysis</Title>
          
          {/* Overall Score */}
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Overall Score</Text>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{analysis.overallScore}%</Text>
            </View>
          </View>

          {/* Section Scores */}
          <Title style={styles.sectionTitle}>Section Breakdown</Title>
          {sections.map(([sectionName, sectionData]) => (
            <View key={sectionName} style={styles.sectionItem}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionName}>{sectionName}</Text>
                <Text style={styles.sectionScore}>{sectionData.score}%</Text>
              </View>
              <ProgressBar
                progress={sectionData.score / 100}
                color={getStatusColor('COMPLETED')}
                style={styles.sectionProgress}
              />
              <Text style={styles.sectionFeedback}>{sectionData.feedback}</Text>
            </View>
          ))}

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Title style={styles.sectionTitle}>Suggestions</Title>
              {analysis.suggestions.map((suggestion, index) => (
                <View key={index} style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>• {suggestion}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Keywords */}
          {analysis.keywords.length > 0 && (
            <View style={styles.keywordsContainer}>
              <Title style={styles.sectionTitle}>Keywords Found</Title>
              <View style={styles.keywordsList}>
                {analysis.keywords.map((keyword, index) => (
                  <Chip key={index} style={styles.keywordChip}>
                    {keyword}
                  </Chip>
                ))}
              </View>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Resume Info */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Title style={styles.resumeTitle}>{resume.fileName}</Title>
              <Chip
                mode="outlined"
                textStyle={{ color: getStatusColor(resume.optimizationStatus) }}
                style={[
                  styles.statusChip,
                  { borderColor: getStatusColor(resume.optimizationStatus) }
                ]}
              >
                {getStatusText(resume.optimizationStatus)}
              </Chip>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>File Size</Text>
              <Text style={styles.infoValue}>{formatFileSize(resume.fileSize)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Upload Date</Text>
              <Text style={styles.infoValue}>
                {new Date(resume.uploadDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Template</Text>
              <Text style={styles.infoValue}>
                {resume.templateId ? 'Applied' : 'None'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Favorite</Text>
              <Text style={styles.infoValue}>
                {resume.isFavorite ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Analysis Section */}
      {renderAnalysisSection()}

      {/* Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Actions</Title>
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              icon="briefcase"
              onPress={() => navigation.navigate('JobMatching' as never)}
              style={styles.actionButton}
              disabled={resume.optimizationStatus !== 'COMPLETED'}
            >
              Find Matching Jobs
            </Button>
            <Button
              mode="outlined"
              icon="pencil"
              onPress={() => {
                // TODO: Implement edit functionality
              }}
              style={styles.actionButton}
            >
              Edit Resume
            </Button>
            <Button
              mode="outlined"
              icon="share"
              onPress={() => {
                // TODO: Implement share functionality
              }}
              style={styles.actionButton}
            >
              Share
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: theme.spacing.lg,
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  resumeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  statusChip: {
    height: 28,
    alignSelf: 'flex-start',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: theme.spacing.md,
  },
  infoLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.onPrimary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionItem: {
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  sectionName: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  sectionScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  sectionProgress: {
    marginBottom: theme.spacing.xs,
  },
  sectionFeedback: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    marginTop: theme.spacing.lg,
  },
  suggestionItem: {
    marginBottom: theme.spacing.sm,
  },
  suggestionText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
  },
  keywordsContainer: {
    marginTop: theme.spacing.lg,
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  keywordChip: {
    marginBottom: theme.spacing.sm,
  },
  actionButtons: {
    gap: theme.spacing.sm,
  },
  actionButton: {
    marginBottom: theme.spacing.sm,
  },
  noAnalysisText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ResumeDetailScreen;
