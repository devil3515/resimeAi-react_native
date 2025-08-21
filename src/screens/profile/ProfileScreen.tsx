import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Button,
  Avatar,
  List,
  Divider,
  Switch,
  Dialog,
  Portal,
  TextInput,
} from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../theme';

const ProfileScreen = () => {
  const { user, logout, updateProfile } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout failed:', error);
            }
          },
        },
      ]
    );
  };

  const handleUpdateProfile = async () => {
    if (!editForm.fullName.trim() || !editForm.email.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      if (user) {
        const updatedUser = {
          ...user,
          fullName: editForm.fullName.trim(),
          email: editForm.email.trim(),
        };
        await updateProfile(updatedUser);
        setEditDialogVisible(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const menuItems = [
    {
      title: 'Account Settings',
      icon: 'account-cog',
      onPress: () => setEditDialogVisible(true),
    },
    {
      title: 'Privacy Policy',
      icon: 'shield-account',
      onPress: () => {
        // TODO: Navigate to privacy policy
      },
    },
    {
      title: 'Terms of Service',
      icon: 'file-document',
      onPress: () => {
        // TODO: Navigate to terms of service
      },
    },
    {
      title: 'Help & Support',
      icon: 'help-circle',
      onPress: () => {
        // TODO: Navigate to help
      },
    },
    {
      title: 'About ResumeAI',
      icon: 'information',
      onPress: () => {
        // TODO: Show about dialog
      },
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text
            size={80}
            label={user?.fullName?.charAt(0) || 'U'}
            style={styles.profileAvatar}
          />
          <View style={styles.profileInfo}>
            <Title style={styles.profileName}>{user?.fullName || 'User'}</Title>
            <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
            <Text style={styles.profileMemberSince}>
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Settings */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Settings</Title>
          
          <List.Item
            title="Push Notifications"
            description="Receive notifications about resume updates and job matches"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={theme.colors.primary}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Dark Mode"
            description="Switch to dark theme"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                color={theme.colors.primary}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Account Menu */}
      <Card style={styles.menuCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Account</Title>
          {menuItems.map((item, index) => (
            <View key={item.title}>
              <List.Item
                title={item.title}
                left={(props) => <List.Icon {...props} icon={item.icon} />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={item.onPress}
                style={styles.menuItem}
              />
              {index < menuItems.length - 1 && <Divider />}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <Button
          mode="outlined"
          icon="logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={theme.colors.error}
        >
          Logout
        </Button>
      </View>

      {/* Edit Profile Dialog */}
      <Portal>
        <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
          <Dialog.Title>Edit Profile</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Full Name"
              value={editForm.fullName}
              onChangeText={(text) => setEditForm(prev => ({ ...prev, fullName: text }))}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="Email"
              value={editForm.email}
              onChangeText={(text) => setEditForm(prev => ({ ...prev, email: text }))}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleUpdateProfile}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileCard: {
    margin: theme.spacing.lg,
    elevation: 3,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  profileAvatar: {
    backgroundColor: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  profileEmail: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.xs,
  },
  profileMemberSince: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  settingsCard: {
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
  menuCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
  },
  menuItem: {
    paddingVertical: theme.spacing.sm,
  },
  logoutContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  logoutButton: {
    borderColor: theme.colors.error,
  },
  dialogInput: {
    marginBottom: theme.spacing.md,
  },
});

export default ProfileScreen;
