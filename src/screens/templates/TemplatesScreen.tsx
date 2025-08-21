import React, { useState } from 'react';
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
  Searchbar,
} from 'react-native-paper';
import { useResume } from '../../contexts/ResumeContext';
import { theme } from '../../theme';
import { ResumeTemplate, TemplateCategory } from '../../types';

const { width } = Dimensions.get('window');

const TemplatesScreen = () => {
  const { templates } = useResume();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'PROFESSIONAL' | 'CREATIVE' | 'EXECUTIVE' | 'MODERN' | 'MINIMAL' | 'CORPORATE' | 'STARTUP'>('ALL');

  const getCategoryColor = (category: TemplateCategory) => {
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

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', 'PROFESSIONAL', 'CREATIVE', 'EXECUTIVE', 'MODERN', 'MINIMAL', 'CORPORATE', 'STARTUP'] as const;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search templates..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={styles.categoryChip}
            >
              {category === 'ALL' ? 'All' : category}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Templates Grid */}
      <View style={styles.templatesContainer}>
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <Card key={template.id} style={styles.templateCard}>
              <Card.Cover
                source={{ uri: template.previewImageUrl }}
                style={styles.templateImage}
              />
              <Card.Content style={styles.templateContent}>
                <View style={styles.templateHeader}>
                  <Title style={styles.templateName}>{template.name}</Title>
                  {template.isPremium && (
                    <Chip mode="outlined" compact style={styles.premiumChip}>
                      Premium
                    </Chip>
                  )}
                </View>
                
                <Text style={styles.templateDescription}>
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

                <View style={styles.templateTags}>
                  {template.tags.slice(0, 3).map((tag, index) => (
                    <Chip key={index} style={styles.tagChip} mode="outlined" compact>
                      {tag}
                    </Chip>
                  ))}
                </View>

                <View style={styles.templateActions}>
                  <Button
                    mode="contained"
                    icon="eye"
                    onPress={() => {
                      // TODO: Show template preview
                    }}
                    style={styles.previewButton}
                  >
                    Preview
                  </Button>
                  <Button
                    mode="outlined"
                    icon="download"
                    onPress={() => {
                      // TODO: Download template
                    }}
                    style={styles.downloadButton}
                  >
                    Download
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory !== 'ALL'
                ? 'No templates match your criteria'
                : 'No templates available'
              }
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || selectedCategory !== 'ALL'
                ? 'Try adjusting your search or category filter'
                : 'Check back later for new templates'
              }
            </Text>
          </View>
        )}
      </View>

      {/* Template Tips */}
      <Card style={styles.tipsCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>💡 Template Selection Tips</Title>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Choose a template that matches your industry and role
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Professional templates work well for corporate positions
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Creative templates are great for design and marketing roles
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Executive templates suit senior and leadership positions
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
  categoryContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  categoryChip: {
    marginRight: theme.spacing.sm,
  },
  templatesContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  templateCard: {
    marginBottom: theme.spacing.lg,
    elevation: 3,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  templateImage: {
    height: 200,
  },
  templateContent: {
    padding: theme.spacing.md,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  premiumChip: {
    height: 24,
  },
  templateDescription: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  templateTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  tagChip: {
    marginBottom: theme.spacing.sm,
  },
  templateActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  previewButton: {
    flex: 1,
  },
  downloadButton: {
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
  tipsCard: {
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
    marginBottom: theme.spacing.md,
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

export default TemplatesScreen;
