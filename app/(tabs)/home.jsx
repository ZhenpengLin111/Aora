import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppWrite from '../../lib/useAppWrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'

const Home = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext()
  const { data: posts, refetch } = useAppWrite(getAllPosts)
  const { data: latestPosts } = useAppWrite(getLatestPosts)

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    // re call videos -> if any new videos appeard
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
            <View className="justify-between items-start 
            flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm
                text-gray-100">
                  Welcome Back,
                </Text>
                <Text className="text-2xl font-psemibold
                text-white">
                  {user?.username}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode='contain'
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg
              font-pregular mb-3">
                Latest Videos
              </Text>

              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Video Found"
            subtitle="Be the first one to upload a video"
          />
        )} // this function can specify what will happen if the list is empty
        refreshControl={<RefreshControl refreshing={refreshing}
          onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  )
}

export default Home