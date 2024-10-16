import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '../../components/EmptyState'
import { getUserPosts, signOut } from '../../lib/appwrite'
import useAppWrite from '../../lib/useAppWrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'
import { icons } from '../../constants'
import InfoBox from '../../components/InfoBox'
import { router } from 'expo-router'

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext()
  const { data: posts } = useAppWrite(
    () => getUserPosts(user.$id)) // pass in the call back function, if not passing a call back function, you would instead pass whatever the output of this function instead of the declation of the function

  const logout = async () => {
    await signOut()
    setUser(null)
    setIsLoggedIn(false)

    router.replace('/sign-in') // can not go back if using replace
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
          <View className="w-full justify-center
          items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logout}
            >
              <Image
                source={icons.logout}
                resizeMode='contain'
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border 
            border-secondary rounded-lg justify-center
            items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode='cover'
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles="mr-10"
                titleStyles="text-xl"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>

          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Video Found"
            subtitle="No videos found for this profile"
          />
        )} // this function can specify what will happen if the list is empty
      />
    </SafeAreaView>
  )
}

export default Profile