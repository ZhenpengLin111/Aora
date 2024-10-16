import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { getUserBookmarkPosts } from '../../lib/appwrite'
import useAppWrite from '../../lib/useAppWrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'
import BookmarkSearchInput from '../../components/BookmarkSearchInput'

const Bookmark = () => {
  const { user } = useGlobalContext()
  const { data: posts, refetch } = useAppWrite(() => getUserBookmarkPosts(user.$id))
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  return (// not using scrollview becasue scrollview doesn't support both horizontal and vertical scroll at the same time
    <SafeAreaView className="bg-primary h-full">
      <FlatList // to render a list of items
        data={posts}
        keyExtractor={(item) => item.$id} // callback function to extract a unique key
        renderItem={({ item }) => (
          <VideoCard video={item} />
        )} // explains react native how we want to render each item in the list
        ListHeaderComponent={() => ( // form the header component
          <View className="my-6 px-4 space-y-6">
            <Text className="text-2xl font-psemibold
                text-white">
              Bookmarked Videos
            </Text>

            <View className="mt-6 mb-4">
              <BookmarkSearchInput />
            </View>

          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Video Found"
            subtitle="No videos found for this bookmark"
          />
        )} // this function can specify what will happen if the list is empty
        refreshControl={<RefreshControl refreshing={refreshing}
          onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  )
}

export default Bookmark