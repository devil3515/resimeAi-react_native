import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Button,
  Chip,
  List,
  Divider,
  FAB,
  Searchbar,
  Menu,
  IconButton,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useResume } from '../../contexts/ResumeContext';
import { theme } from '../../theme';
import { Resume, OptimizationStatus } from '../../types';

const ResumeListScreen = () => {
  const navigation = useNavigation();
  const { resumes, getResumes, deleteResume, isLoading } = useResume();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'>('ALL');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDeleteResume = (resume: Resume) => {
    Alert.alert(
      'Delete Resume',
      `Are you sure you want to delete "${resume.fileName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteResume(resume.id);
            } catch (error) {
              console.error('Delete failed:', error);
            }
          },
        },
      ]
    );
  };

  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = resume.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || resume.optimizationStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const renderFilterChips = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Chip
          selected={filterStatus === 'ALL'}
          onPress={() => setFilterStatus('ALL')}
          style={styles.filterChip}
        >
          All
        </Chip>
        <Chip
          selected={filterStatus === 'PENDING'}
          onPress={() => setFilterStatus('PENDING')}
          style={styles.filterChip}
        >
          Pending
        </Chip>
        <Chip
          selected={filterStatus === 'IN_PROGRESS'}
          onPress={() => setFilterStatus('IN_PROGRESS')}
          style={styles.filterChip}
        >
          Processing
        </Chip>
        <Chip
          selected={filterStatus === 'COMPLETED'}
          onPress={() => setFilterStatus('COMPLETED')}
          style={styles.filterChip}
        >
          Completed
        </Chip>
        <Chip
          selected={filterStatus === 'FAILED'}
          onPress={() => setFilterStatus('FAILED')}
          style={styles.filterChip}
        >
          Failed
        </Chip>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search resumes..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
        </View>

        {renderFilterChips()}

        {/* Resume List */}
        <View style={styles.resumeList}>
          {filteredResumes.length > 0 ? (
            filteredResumes.map((resume, index) => (
              <Card key={resume.id} style={styles.resumeCard}>
                <Card.Content>
                  <View style={styles.resumeHeader}>
                    <View style={styles.resumeInfo}>
                      <Title style={styles.resumeTitle}>{resume.fileName}</Title>
                      <Text style={styles.resumeMeta}>
                        {formatFileSize(resume.fileSize)} • Uploaded {new Date(resume.uploadDate).toLocaleDateString()}
                      </Text>
                    </View>
                    <Menu
                      visible={menuVisible === resume.id}
                      onDismiss={() => setMenuVisible(null)}
                      anchor={
                        <IconButton
                          icon="dots-vertical"
                          onPress={() => setMenuVisible(resume.id)}
                        />
                      }
                    >
                      <Menu.Item
                        onPress={() => {
                          setMenuVisible(null);
                          (navigation as any).navigate('ResumeDetail', { resumeId: resume.id });
                        }}
                        title="View Details"
                        leadingIcon="eye"
                      />
                      <Menu.Item
                        onPress={() => {
                          setMenuVisible(null);
                          // TODO: Implement edit functionality
                        }}
                        title="Edit"
                        leadingIcon="pencil"
                      />
                      <Menu.Item
                        onPress={() => {
                          setMenuVisible(null);
                          handleDeleteResume(resume);
                        }}
                        title="Delete"
                        leadingIcon="delete"
                      />
                    </Menu>
                  </View>

                  <View style={styles.resumeFooter}>
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
                    
                    <View style={styles.actionButtons}>
                      <Button
                        mode="outlined"
                        compact
                        onPress={() => (navigation as any).navigate('ResumeDetail', { resumeId: resume.id })}
                      >
                        View
                      </Button>
                      {resume.optimizationStatus === 'COMPLETED' && (
                        <Button
                          mode="contained"
                          compact
                          onPress={() => navigation.navigate('JobMatching' as never)}
                        >
                          Find Jobs
                        </Button>
                      )}
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {searchQuery || filterStatus !== 'ALL' 
                  ? 'No resumes match your search criteria'
                  : 'No resumes yet'
                }
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery || filterStatus !== 'ALL'
                  ? 'Try adjusting your search or filters'
                  : 'Upload your first resume to get started'
                }
              </Text>
              {!searchQuery && filterStatus === 'ALL' && (
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('ResumeUpload' as never)}
                  style={styles.uploadButton}
                >
                  Upload Resume
                </Button>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('ResumeUpload' as never)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  searchBar: {
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  filterContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  filterChip: {
    marginRight: theme.spacing.sm,
  },
  resumeList: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  resumeCard: {
    marginBottom: theme.spacing.md,
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  resumeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  resumeInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  resumeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  resumeMeta: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  resumeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusChip: {
    height: 28,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
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
    marginBottom: theme.spacing.lg,
  },
  uploadButton: {
    marginTop: theme.spacing.sm,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.lg,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default ResumeListScreen;
