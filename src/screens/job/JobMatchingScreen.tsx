import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Button,
  Chip,
  Searchbar,
  List,
  Divider,
  ProgressBar,
} from 'react-native-paper';
import { useResume } from '../../contexts/ResumeContext';
import { theme } from '../../theme';
import { JobMatch, JobDescription } from '../../types';

const JobMatchingScreen = () => {
  const { resumes } = useResume();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);

  // Mock job matches data
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([
    {
      id: '1',
      resumeId: '1',
      jobTitle: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      jobDescription: 'We are looking for an experienced software engineer...',
      matchPercentage: 85,
      matchedSkills: ['React', 'TypeScript', 'Node.js'],
      missingSkills: ['AWS', 'Docker'],
      suggestions: ['Consider adding cloud computing experience', 'Learn containerization'],
      createdAt: Date.now(),
    },
    {
      id: '2',
      resumeId: '1',
      jobTitle: 'Full Stack Developer',
      company: 'StartupXYZ',
      jobDescription: 'Join our fast-growing startup as a full stack developer...',
      matchPercentage: 78,
      matchedSkills: ['JavaScript', 'React', 'Node.js'],
      missingSkills: ['Python', 'MongoDB'],
      suggestions: ['Add Python to your skillset', 'Learn NoSQL databases'],
      createdAt: Date.now() - 86400000,
    },
  ]);

  const [jobDescriptions] = useState<JobDescription[]>([
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      description: 'We are looking for an experienced software engineer to join our team...',
      requiredSkills: ['React', 'TypeScript', 'Node.js', '5+ years experience'],
      preferredSkills: ['AWS', 'Docker', 'Kubernetes'],
      experience: '5+ years',
      location: 'San Francisco, CA',
      salary: '$120k - $180k',
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      description: 'Join our fast-growing startup as a full stack developer...',
      requiredSkills: ['JavaScript', 'React', 'Node.js', '3+ years experience'],
      preferredSkills: ['Python', 'MongoDB', 'GraphQL'],
      experience: '3+ years',
      location: 'Remote',
      salary: '$90k - $130k',
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Implement actual API call
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return theme.colors.primary;
    if (percentage >= 60) return theme.colors.secondary;
    return theme.colors.error;
  };

  const getMatchLabel = (percentage: number) => {
    if (percentage >= 80) return 'Excellent Match';
    if (percentage >= 60) return 'Good Match';
    return 'Low Match';
  };

  const filteredJobMatches = jobMatches.filter(match => {
    const matchesSearch = 
      match.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesResume = !selectedResume || match.resumeId === selectedResume;
    return matchesSearch && matchesResume;
  });

  const completedResumes = resumes.filter(r => r.optimizationStatus === 'COMPLETED');

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Resume Selection */}
      {completedResumes.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Select Resume</Title>
            <Text style={styles.cardSubtitle}>
              Choose a resume to find matching jobs
            </Text>
            <View style={styles.resumeSelector}>
              {completedResumes.map((resume) => (
                <Chip
                  key={resume.id}
                  selected={selectedResume === resume.id}
                  onPress={() => setSelectedResume(resume.id)}
                  style={styles.resumeChip}
                >
                  {resume.fileName}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Search */}
      <Card style={styles.card}>
        <Card.Content>
          <Searchbar
            placeholder="Search jobs..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
        </Card.Content>
      </Card>

      {/* Job Matches */}
      <View style={styles.jobList}>
        {filteredJobMatches.length > 0 ? (
          filteredJobMatches.map((jobMatch, index) => (
            <Card key={jobMatch.id} style={styles.jobCard}>
              <Card.Content>
                <View style={styles.jobHeader}>
                  <View style={styles.jobInfo}>
                    <Title style={styles.jobTitle}>{jobMatch.jobTitle}</Title>
                    <Text style={styles.jobCompany}>{jobMatch.company}</Text>
                  </View>
                  <View style={styles.matchInfo}>
                    <Text style={styles.matchPercentage}>{jobMatch.matchPercentage}%</Text>
                    <Text style={[
                      styles.matchLabel,
                      { color: getMatchColor(jobMatch.matchPercentage) }
                    ]}>
                      {getMatchLabel(jobMatch.matchPercentage)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.jobDescription} numberOfLines={3}>
                  {jobMatch.jobDescription}
                </Text>

                {/* Match Details */}
                <View style={styles.matchDetails}>
                  <View style={styles.skillsSection}>
                    <Text style={styles.skillsTitle}>Matched Skills</Text>
                    <View style={styles.skillsList}>
                      {jobMatch.matchedSkills.map((skill, idx) => (
                        <Chip key={idx} style={styles.skillChip} mode="outlined">
                          {skill}
                        </Chip>
                      ))}
                    </View>
                  </View>

                  {jobMatch.missingSkills.length > 0 && (
                    <View style={styles.skillsSection}>
                      <Text style={styles.skillsTitle}>Missing Skills</Text>
                      <View style={styles.skillsList}>
                        {jobMatch.missingSkills.map((skill, idx) => (
                          <Chip 
                            key={idx} 
                            style={[styles.skillChip, styles.missingSkillChip]} 
                            mode="outlined"
                          >
                            {skill}
                          </Chip>
                        ))}
                      </View>
                    </View>
                  )}

                  {jobMatch.suggestions.length > 0 && (
                    <View style={styles.suggestionsSection}>
                      <Text style={styles.suggestionsTitle}>Suggestions</Text>
                      {jobMatch.suggestions.map((suggestion, idx) => (
                        <Text key={idx} style={styles.suggestionText}>
                          • {suggestion}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>

                {/* Actions */}
                <View style={styles.jobActions}>
                  <Button
                    mode="contained"
                    icon="briefcase"
                    onPress={() => {
                      // TODO: Implement apply functionality
                    }}
                    style={styles.applyButton}
                  >
                    Apply Now
                  </Button>
                  <Button
                    mode="outlined"
                    icon="eye"
                    onPress={() => {
                      // TODO: Show full job description
                    }}
                  >
                    View Details
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? 'No jobs match your search criteria'
                : 'No job matches found'
              }
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Make sure you have an optimized resume and try again later'
              }
            </Text>
          </View>
        )}
      </View>

      {/* Tips */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>💡 Job Matching Tips</Title>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Keep your resume updated with relevant skills
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Use industry-specific keywords in your resume
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Regularly optimize your resume for different roles
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Consider learning missing skills to improve matches
            </Text>
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
  },
  card: {
    margin: theme.spacing.lg,
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
    marginBottom: theme.spacing.sm,
  },
  cardSubtitle: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.md,
  },
  resumeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  resumeChip: {
    marginBottom: theme.spacing.sm,
  },
  searchBar: {
    elevation: 0,
  },
  jobList: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  jobCard: {
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
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  jobInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  jobCompany: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  matchInfo: {
    alignItems: 'center',
  },
  matchPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  matchLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  jobDescription: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  matchDetails: {
    marginBottom: theme.spacing.md,
  },
  skillsSection: {
    marginBottom: theme.spacing.md,
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  skillChip: {
    marginBottom: theme.spacing.sm,
  },
  missingSkillChip: {
    borderColor: theme.colors.error,
  },
  suggestionsSection: {
    marginBottom: theme.spacing.md,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  suggestionText: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.xs,
    lineHeight: 16,
  },
  jobActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  applyButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  tipItem: {
    marginBottom: theme.spacing.sm,
  },
  tipText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
  },
});

export default JobMatchingScreen;
