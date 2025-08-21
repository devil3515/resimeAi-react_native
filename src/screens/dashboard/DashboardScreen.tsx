import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Avatar,
  List,
  Divider,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useResume } from '../../contexts/ResumeContext';
import { theme } from '../../theme';
import { Resume, OptimizationStatus } from '../../types';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { resumes, getResumes, isLoading } = useResume();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getResumes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getResumes();
    setRefreshing(false);
  };

  const getStatusColor = (status: OptimizationStatus) => {
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

  const getStatusText = (status: OptimizationStatus) => {
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

  const recentResumes = resumes.slice(0, 3);
  const completedResumes = resumes.filter(r => r.optimizationStatus === 'COMPLETED').length;
  const pendingResumes = resumes.filter(r => r.optimizationStatus === 'PENDING').length;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
          </View>
          <Avatar.Text
            size={50}
            label={user?.fullName?.charAt(0) || 'U'}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={styles.statNumber}>{resumes.length}</Text>
            <Text style={styles.statLabel}>Total Resumes</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={styles.statNumber}>{completedResumes}</Text>
            <Text style={styles.statLabel}>Optimized</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={styles.statNumber}>{pendingResumes}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Actions</Title>
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              icon="upload"
              onPress={() => navigation.navigate('ResumeUpload' as never)}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Upload Resume
            </Button>
            <Button
              mode="outlined"
              icon="briefcase"
              onPress={() => navigation.navigate('JobMatching' as never)}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Find Jobs
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Recent Resumes */}
      <Card style={styles.recentCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Recent Resumes</Title>
            <Button
              mode="text"
              onPress={() => navigation.navigate('ResumeList' as never)}
            >
              View All
            </Button>
          </View>
          
          {recentResumes.length > 0 ? (
            recentResumes.map((resume, index) => (
              <View key={resume.id}>
                <List.Item
                  title={resume.fileName}
                  description={`Uploaded ${new Date(resume.uploadDate).toLocaleDateString()}`}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="file-document"
                      color={theme.colors.primary}
                    />
                  )}
                  right={() => (
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
                  )}
                  onPress={() => (navigation as any).navigate('ResumeDetail', { resumeId: resume.id })}
                  style={styles.resumeItem}
                />
                {index < recentResumes.length - 1 && <Divider />}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No resumes yet</Text>
              <Text style={styles.emptySubtext}>
                Upload your first resume to get started
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('ResumeUpload' as never)}
                style={styles.uploadButton}
              >
                Upload Resume
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Tips Section */}
      <Card style={styles.tipsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>💡 Pro Tips</Title>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Keep your resume updated with recent experiences
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Use relevant keywords for better job matching
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Regularly optimize your resume for different roles
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
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: theme.colors.onPrimary,
    opacity: 0.8,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onPrimary,
  },
  avatar: {
    backgroundColor: theme.colors.onPrimary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginTop: -theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: theme.spacing.xs,
  },
  actionsCard: {
    marginHorizontal: theme.spacing.lg,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  actionButtonContent: {
    paddingVertical: theme.spacing.sm,
  },
  recentCard: {
    marginHorizontal: theme.spacing.lg,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  resumeItem: {
    paddingVertical: theme.spacing.sm,
  },
  statusChip: {
    height: 28,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  uploadButton: {
    marginTop: theme.spacing.sm,
  },
  tipsCard: {
    marginHorizontal: theme.spacing.lg,
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
  tipItem: {
    marginBottom: theme.spacing.sm,
  },
  tipText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
  },
});

export default DashboardScreen;
