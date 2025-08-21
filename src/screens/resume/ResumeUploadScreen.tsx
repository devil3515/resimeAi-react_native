import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
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
import { useNavigation } from '@react-navigation/stack';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { useResume } from '../../contexts/ResumeContext';
import { theme } from '../../theme';
import { ResumeTemplate, ResumeUploadForm } from '../../types';

const ResumeUploadScreen = () => {
  const navigation = useNavigation();
  const { templates, uploadResume, isLoading } = useResume();
  const [selectedFile, setSelectedFile] = useState<DocumentPickerResponse | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.docx],
        copyTo: 'cachesDirectory',
      });
      
      if (result.length > 0) {
        const file = result[0];
        if (file.size && file.size > 10 * 1024 * 1024) { // 10MB limit
          Alert.alert('File Too Large', 'Please select a file smaller than 10MB');
          return;
        }
        setSelectedFile(file);
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Failed to pick file');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert('No File Selected', 'Please select a resume file to upload');
      return;
    }

    try {
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 0.9) {
            clearInterval(progressInterval);
            return 0.9;
          }
          return prev + 0.1;
        });
      }, 200);

      const form: ResumeUploadForm = {
        file: selectedFile,
        templateId: selectedTemplate?.id,
      };

      await uploadResume(form);
      
      setUploadProgress(1);
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
      
    } catch (error) {
      Alert.alert('Upload Failed', 'Failed to upload resume. Please try again.');
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'PROFESSIONAL':
        return theme.colors.primary;
      case 'CREATIVE':
        return theme.colors.secondary;
      case 'EXECUTIVE':
        return theme.colors.tertiary;
      default:
        return theme.colors.outline;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* File Selection */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Select Resume File</Title>
          <Text style={styles.cardSubtitle}>
            Choose a PDF or DOCX file to upload
          </Text>
          
          {selectedFile ? (
            <View style={styles.selectedFile}>
              <List.Item
                title={selectedFile.name}
                description={`${formatFileSize(selectedFile.size || 0)} • ${selectedFile.type}`}
                left={(props) => (
                  <List.Icon {...props} icon="file-document" color={theme.colors.primary} />
                )}
                right={() => (
                  <Button
                    mode="outlined"
                    onPress={() => setSelectedFile(null)}
                    compact
                  >
                    Remove
                  </Button>
                )}
              />
            </View>
          ) : (
            <Button
              mode="outlined"
              icon="upload"
              onPress={handleFilePick}
              style={styles.uploadButton}
              contentStyle={styles.uploadButtonContent}
            >
              Choose File
            </Button>
          )}
        </Card.Content>
      </Card>

      {/* Template Selection */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Choose Template (Optional)</Title>
          <Text style={styles.cardSubtitle}>
            Select a template to apply to your resume
          </Text>
          
          <View style={styles.templateGrid}>
            {templates.map((template) => (
              <Card
                key={template.id}
                style={[
                  styles.templateCard,
                  selectedTemplate?.id === template.id && styles.selectedTemplate
                ]}
                onPress={() => setSelectedTemplate(template)}
              >
                <Card.Content style={styles.templateContent}>
                  <View style={styles.templateHeader}>
                    <Text style={styles.templateName}>{template.name}</Text>
                    {template.isPremium && (
                      <Chip mode="outlined" compact style={styles.premiumChip}>
                        Premium
                      </Chip>
                    )}
                  </View>
                  <Text style={styles.templateDescription} numberOfLines={2}>
                    {template.description}
                  </Text>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getCategoryColor(template.category) }}
                    style={[
                      styles.categoryChip,
                      { borderColor: getCategoryColor(template.category) }
                    ]}
                  >
                    {template.category}
                  </Chip>
                </Card.Content>
              </Card>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Upload Progress */}
      {uploadProgress > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Upload Progress</Title>
            <ProgressBar
              progress={uploadProgress}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              {Math.round(uploadProgress * 100)}% Complete
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Upload Button */}
      <View style={styles.uploadContainer}>
        <Button
          mode="contained"
          icon="upload"
          onPress={handleUpload}
          loading={isLoading}
          disabled={!selectedFile || isLoading}
          style={styles.uploadButton}
          contentStyle={styles.uploadButtonContent}
        >
          Upload Resume
        </Button>
      </View>

      {/* Tips */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>💡 Upload Tips</Title>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Ensure your resume is in PDF or DOCX format
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Keep file size under 10MB for faster processing
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Choose a template that matches your industry
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Make sure your resume is up-to-date
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
    padding: theme.spacing.lg,
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
    marginBottom: theme.spacing.sm,
  },
  cardSubtitle: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.md,
  },
  uploadButton: {
    marginTop: theme.spacing.sm,
  },
  uploadButtonContent: {
    paddingVertical: theme.spacing.sm,
  },
  selectedFile: {
    marginTop: theme.spacing.md,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  templateCard: {
    width: '48%',
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTemplate: {
    borderColor: theme.colors.primary,
  },
  templateContent: {
    padding: theme.spacing.sm,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  templateName: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  premiumChip: {
    height: 20,
  },
  templateDescription: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.sm,
    lineHeight: 16,
  },
  categoryChip: {
    height: 24,
    alignSelf: 'flex-start',
  },
  progressBar: {
    marginBottom: theme.spacing.sm,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  uploadContainer: {
    marginBottom: theme.spacing.lg,
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

export default ResumeUploadScreen;
