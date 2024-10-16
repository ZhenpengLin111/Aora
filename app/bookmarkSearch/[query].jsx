import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '../../components/EmptyState'
import { searchBookmarkPosts } from '../../lib/appwrite'
import useAppWrite from '../../lib/useAppWrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import BookmarkSearchInput from '../../components/BookmarkSearchInput'

const SearchBookmark = () => {
  const { user } = useGlobalContext()
  const { query } = useLocalSearchParams()
  const { data: posts, refetch } = useAppWrite(
    () => searchBookmarkPosts(user.$id, query)) // pass in the call back function, if not passing a call back function, you would instead pass whatever the output of this function instead of the declation of the function

  useEffect(() => {
    refetch()
  }, [query])

  // call everytime the user search something new

  return (// not using scrollview becasue scrollview doesn't support both horizontal and vertical scroll at the same time
    <SafeAreaView className="bg-primary h-full">
      <FlatList // to render a list of items
        data={posts}
        keyExtractor={(item) => item.$id} // callback function to extract a unique key
        renderItem={({ item }) => (
          <VideoCard video={item} />
        )} // explains react native how we want to render each item in the list
        ListHeaderComponent={() => ( // form the header component
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm
                text-gray-100">
              Search Results
            </Text>
            <Text className="text-2xl font-psemibold
                text-white">
              {query}
            </Text>
            <View className="mt-6 mb-8">
              <BookmarkSearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Video Found"
            subtitle="No videos found for this bookmark"
          />
        )} // this function can specify what will happen if the list is empty
      />
    </SafeAreaView>
  )
}

export default SearchBookmark