import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import Header from './components/Header';
import ListItem from './components/ListItem';
import AddItem from './components/AddItem';
import { v4 } from 'uuid';

const App = () => {
  const [items, setItems] = useState([
    {
      id: v4(),
      text: 'Milk',
    },
    {
      id: v4(),
      text: 'Eggs',
    },
    {
      id: v4(),
      text: 'Bread',
    },
    {
      id: v4(),
      text: 'Juice',
    },
  ]);

  // Flag true if user is currently editing an item
  const [editStatus, editStatusChange] = useState(false);

  // State to capture information about the item being edited
  const [editItemDetail, editItemDetailChange] = useState({
    id: null,
    text: null,
  });

  const [checkedItems, checkedItemChange] = useState([]);

  const deleteItem = id => {
    setItems(prevItems => {
      return prevItems.filter(item => item.id !== id);
    });
  };

  // Submit the users edits to the overall items state
  const saveEditItem = (id) => {
    setItems(prevItems => {
      return prevItems.map(item =>
        item.id === editItemDetail.id ? { id, text: editItemDetail.text } : item,
      );
    });
    // Flip edit status back to false
    editStatusChange(!editStatus);
  };

  // Event handler to capture users text input as they edit an item
  const handleEditChange = text => {
    editItemDetailChange({ id: editItemDetail.id, text });
  };

  const addItem = text => {
    if (!text) {
      Alert.alert(
        'No item given',
        'Please enter an item for adding to your shopping list',
        [
          {
            text: 'Got it',
            style: 'cancel',
          },
        ],
        { cancelable: true },
      );
    } else {
      setItems(prevItems => {
        return [{ id: v4(), text }, ...prevItems];
      });
    }
  };

  // capture old items ID and text when user clicks edit
  const editItem = (id, text) => {
    editItemDetailChange({
      id,
      text,
    });
    return editStatusChange(!editStatus);
  };

  const itemChecked = (id, text) => {
    const isChecked = checkedItems.filter(checkedItem => checkedItem.id === id);
    isChecked.length
      ? // remove item from checked items state (uncheck)
      checkedItemChange(prevItems => {
        return [...prevItems.filter(item => item.id !== id)];
      })
      : // Add item to checked items state
      checkedItemChange(prevItems => {
        return [...prevItems.filter(item => item.id !== id), { id, text }];
      });
  };

  return (
    <View style={styles.container}>
      <Header title="Grocery List" />
      <AddItem addItem={addItem} />
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <ListItem
            item={item}
            deleteItem={deleteItem}
            editItem={editItem}
            isEditing={editStatus}
            editItemDetail={editItemDetail}
            saveEditItem={saveEditItem}
            handleEditChange={handleEditChange}
            itemChecked={itemChecked}
            checkedItems={checkedItems}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;