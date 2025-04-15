import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Alert,
  Modal as RNModal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// API services import
import FoodGroupApi from '../../services/axios/FoodGroup';
import LocationApi from '../../services/axios/Location';
import WarehouseApi from '../../services/axios/Warehouse';
import CookbookApi from '../../services/axios/Cookbook';

// Types
import {
  FoodGroup,
  Location,
  Warehouse,
  Cookbook,
  FoodGroupFormData,
  LocationFormData,
  WarehouseFormData,
  CookbookFormData,
} from './types';

type CategoryKey = 'foodGroups' | 'locations' | 'warehouses' | 'cookbook';
type Categories = Record<
  CategoryKey,
  (FoodGroup | Location | Warehouse | Cookbook)[]
>;

interface CategoryConfig {
  title: string;
  key: CategoryKey;
  api: any;
}

const LabelsScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<CategoryKey>('foodGroups');
  const [categories, setCategories] = useState<Categories>({
    foodGroups: [],
    locations: [],
    warehouses: [],
    cookbook: [],
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalState, setModalState] = useState({
    itemName: '',
    currentCategory: 'foodGroups' as CategoryKey,
    editingId: '',
    isEdit: false,
  });

  // Category configuration maps
  const categoryConfigs: CategoryConfig[] = [
    {
      title: 'Food Groups',
      key: 'foodGroups',
      api: FoodGroupApi,
    },
    {
      title: 'Locations',
      key: 'locations',
      api: LocationApi,
    },
    {
      title: 'Warehouses',
      key: 'warehouses',
      api: WarehouseApi,
    },
    {
      title: 'Cookbooks',
      key: 'cookbook',
      api: CookbookApi,
    },
  ];

  useEffect(() => {
    loadData();
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const promises = categoryConfigs.map(async config => {
        let data;
        switch (config.key) {
          case 'foodGroups':
            data = await FoodGroupApi.get();
            break;
          case 'locations':
            data = await LocationApi.get();
            break;
          case 'warehouses':
            data = await WarehouseApi.get();
            break;
          case 'cookbook':
            data = await CookbookApi.get();
            break;
        }
        return {key: config.key, data};
      });

      const results = await Promise.all(promises);
      const newCategories = {...categories};

      results.forEach(({key, data}) => {
        newCategories[key] = data;
      });

      setCategories(newCategories);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalOpen = (
    category: CategoryKey,
    item?: FoodGroup | Location | Warehouse | Cookbook,
  ) => {
    setModalState({
      itemName: item?.name || '',
      currentCategory: category,
      editingId: item?._id || '',
      isEdit: !!item,
    });
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setModalState({
      itemName: '',
      currentCategory: activeTab,
      editingId: '',
      isEdit: false,
    });
  };

  const handleSave = async () => {
    const {itemName, currentCategory, editingId} = modalState;

    if (!itemName.trim()) return;

    setActionLoading(true);
    try {
      let updatedItem;
      const formData = {
        _id: editingId,
        name: itemName,
      };

      if (editingId) {
        // Update existing item using the appropriate API
        switch (currentCategory) {
          case 'foodGroups':
            updatedItem = await FoodGroupApi.put(
              editingId,
              formData as FoodGroupFormData,
            );
            break;
          case 'locations':
            updatedItem = await LocationApi.put(
              editingId,
              formData as LocationFormData,
            );
            break;
          case 'warehouses':
            updatedItem = await WarehouseApi.put(
              editingId,
              formData as WarehouseFormData,
            );
            break;
          case 'cookbook':
            updatedItem = await CookbookApi.put(
              editingId,
              formData as CookbookFormData,
            );
            break;
          default:
            throw new Error('Invalid category');
        }
      } else {
        // Create new item using the appropriate API
        switch (currentCategory) {
          case 'foodGroups':
            updatedItem = await FoodGroupApi.post({
              name: itemName,
            } as FoodGroupFormData);
            break;
          case 'locations':
            updatedItem = await LocationApi.post({
              name: itemName,
            } as LocationFormData);
            break;
          case 'warehouses':
            updatedItem = await WarehouseApi.post({
              name: itemName,
            } as WarehouseFormData);
            break;
          case 'cookbook':
            updatedItem = await CookbookApi.post({
              name: itemName,
            } as CookbookFormData);
            break;
          default:
            throw new Error('Invalid category');
        }
      }

      setCategories(prev => {
        const result = {...prev};

        if (editingId) {
          result[currentCategory] = prev[currentCategory].map(item =>
            item._id === editingId ? updatedItem : item,
          );
        } else {
          result[currentCategory] = [
            ...(prev[currentCategory]?.length > 0 ? prev[currentCategory] : []),
            updatedItem,
          ];
        }

        return result;
      });

      handleModalClose();
    } catch (error) {
      Alert.alert(
        'Error',
        editingId ? 'Failed to update item' : 'Failed to create item',
      );
      console.error('Error saving item:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (item: {_id: string}) => {
    Alert.alert('Confirmation', 'Are you sure you want to delete this item?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setActionLoading(true);

            // Delete item using the appropriate API
            switch (activeTab) {
              case 'foodGroups':
                await FoodGroupApi.delete(item._id);
                break;
              case 'locations':
                await LocationApi.delete(item._id);
                break;
              case 'warehouses':
                await WarehouseApi.delete(item._id);
                break;
              case 'cookbook':
                await CookbookApi.delete(item._id);
                break;
              default:
                throw new Error('Invalid category');
            }

            setCategories(prev => ({
              ...prev,
              [activeTab]: prev[activeTab].filter(el => el._id !== item._id),
            }));
          } catch (error) {
            Alert.alert('Error', 'Failed to delete item');
            console.error('Error deleting item:', error);
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.name}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleModalOpen(activeTab, item)}>
          <Icon name="edit-2" size={18} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}>
          <Icon name="trash-2" size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderModalContent = () => (
    <RNModal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleModalClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {modalState.isEdit ? 'Edit' : 'Add'}
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              value={modalState.itemName}
              onChangeText={text =>
                setModalState(prev => ({
                  ...prev,
                  itemName: text,
                }))
              }
              autoFocus
            />
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleModalClose}
              disabled={actionLoading}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                actionLoading && styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={actionLoading}>
              {actionLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </RNModal>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Labels</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabsContainer}>
        {categoryConfigs.map(config => (
          <TouchableOpacity
            key={config.key}
            style={[styles.tab, activeTab === config.key && styles.activeTab]}
            onPress={() => setActiveTab(config.key)}>
            <Text
              style={[
                styles.tabText,
                activeTab === config.key && styles.activeTabText,
              ]}>
              {config.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>
            {categoryConfigs.find(c => c.key === activeTab)?.title}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleModalOpen(activeTab)}>
            <Icon
              name="plus-circle"
              size={18}
              color="#ffffff"
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Name</Text>
          <Text style={[styles.tableHeaderText, styles.actionsHeader]}>
            Actions
          </Text>
        </View>

        {/* Table Content */}
        <FlatList
          data={categories[activeTab]}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text style={styles.emptyListText}>No items found</Text>
            </View>
          }
        />
      </View>

      {renderModalContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#EEF2FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  addButtonIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: '600',
    color: '#374151',
  },
  actionsHeader: {
    width: 120,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  tableCell: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
  },
  actionsContainer: {
    flexDirection: 'row',
    width: 120,
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#3B82F6',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    padding: 8,
    borderRadius: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#4B5563',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  emptyList: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  emptyListText: {
    color: '#6B7280',
    fontSize: 15,
  },
});

export default LabelsScreen;
