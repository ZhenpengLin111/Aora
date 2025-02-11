import { View, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { router, usePathname } from 'expo-router'

const BookmarkSearchInput = ({ initialQuery }) => {
  const pathname = usePathname()
  const [query, setQuery] = useState(initialQuery || '')

  return (
    <View className="border-2 border-black-200 w-full
      h-16 px-4 bg-black-100 rounded-2xl
      focus:border-secondary items-center flex-row
      space-x-4">
      <TextInput
        className="flex-1 mt-0.5 text-white font-pregular 
          text-base"
        value={query}
        placeholder="Search your bookmarked videos"
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert('Missing query',
              "Please input something to search results across database"
            )
          }
          if (pathname.startsWith('/bookmarkSearch')) router.setParams({ query }) // if we are already on the search page
          else router.push(`/bookmarkSearch/${query}`) // if not on the search page
        }}
      >
        <Image
          source={icons.search}
          className='w-5 h-5'
          resizeMode='contain'
        />
      </TouchableOpacity>
    </View>
  )
}

export default BookmarkSearchInput