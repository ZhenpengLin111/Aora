import { View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { Menu, Provider } from 'react-native-paper';
import { bookmarkPost, unBookmarkPost } from '../lib/appwrite';
import { useGlobalContext } from '../context/GlobalProvider';

const MenuCard = ({ documentId, bookmarks }) => {
  const { user } = useGlobalContext()
  const [visible, setVisible] = useState(false);

  const closeMenu = () => setVisible(false);
  const openMenu = () => setVisible(true);

  const bookmarkVideo = async () => {
    await bookmarkPost(documentId, user.$id)
    closeMenu()
  }

  const unBookmarkVideo = async () => {
    await unBookmarkPost(documentId, user.$id)
    closeMenu()
  }

  return (
    <Provider>
      <View>
        <Menu
          className="text-white"
          style={{ left: -130, top: -25, position: 'absolute' }}
          contentStyle={{ backgroundColor: '#1E1E2D', borderColor: '#232533' }}
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              <Image
                source={icons.menu}
                className="w-5 h-5"
                resizeMode='contain'
              />
            </TouchableOpacity>

          }>
          {
            !bookmarks?.includes(user?.$id) ?
              <View>
                <Menu.Item
                  titleStyle={{ color: 'white' }}
                  onPress={bookmarkVideo}
                  title="Bookmark"
                />
              </View> :
              <Menu.Item
                titleStyle={{ color: 'white' }}
                onPress={unBookmarkVideo}
                title="Unbookmark"
              />
          }

        </Menu>
      </View>
    </Provider >

  )
}

export default MenuCard