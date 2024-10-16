import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';
export const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1', // this is their(appwrite) hosted version of the platform
  platform: 'com.jsm.aora',
  projectId: '66f37074003a0ddf9cf8',
  databaseId: '66f374100005f7a11dbd',
  userCollectionId: '66f3744400383f669398',
  videoCollectionId: '66f3748c00058e06e67f',
  storageId: '66f377fc003ba881eb3f'
}

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId
} = appwriteConfig

// Init your React Native SDK
const client = new Client();
const avatars = new Avatars(client)
const databases = new Databases(client) // create an instance of databases
const storage = new Storage(client)

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.

const account = new Account(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(), // user ID
      email,
      password,
      username
    )

    if (!newAccount) throw Error

    const avatarUrl = avatars.getInitials(username) // a special function which basically gets the initials of the user's name and then uploads that so get the special URL so you can pass the username right in.

    await signIn(email, password)

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl
      }
    )

    return newUser
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

const deleteSession = async () => {
  try {
    const activeSessions = await account.listSessions()
    if (activeSessions.total > 0) {
      await account.deleteSession("current")
    }
  } catch (error) {
    console.log("No session available.")
  }
}

export const signIn = async (email, password) => {
  try {
    await deleteSession()
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)] // get the exact user that's currently logged in
    )

    if (!currentUser) throw Error

    return currentUser.documents[0]
  } catch (error) {
    console.log(error);
  }
}

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt')]
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(7))]
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.search('title', query)]
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const signOut = async () => {
  try {
    const session = await account.deleteSession('current')
    return session
  } catch (error) {
    throw new Error(error)
  }
}

export const getFilePreview = async (fileId, type) => {
  let fileUrl

  try {
    if (type === 'video') {
      fileUrl = storage.getFileView(storageId, fileId)
    } else if (type === 'image') {
      fileUrl = storage.getFilePreview(
        storageId, fileId, 2000, 2000, 'top', 100
      )
    } else {
      throw new Error('Invalid file type')
    }

    if (!fileUrl) throw Error

    return fileUrl
  } catch (error) {

  }
}

export const uploadFile = async (file, type) => {
  if (!file) return

  const asset = {
    name: file.fileName,
    type: file.mineType,
    size: file.fileSize,
    uri: file.uri
  }

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    )

    const fileUrl = await getFilePreview(
      uploadedFile.$id, type
    ) // get the file url back from appwrite

    return fileUrl
  } catch (error) {
    throw new Error(error)
  }
}

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
      uploadFile(form.video, 'video')
    ])

    const newPost = await databases.createDocument(
      databaseId, videoCollectionId, ID.unique(), {
      title: form.title,
      thumbnail: thumbnailUrl,
      video: videoUrl,
      prompt: form.prompt,
      creator: form.userId
    }
    )

    return newPost
  } catch (error) {
    throw new Error(error)
  }
}

export const bookmarkPost = async (documentId, userId) => {
  try {
    const doc = await databases.getDocument(
      databaseId,
      videoCollectionId,
      documentId
    )

    if (doc.bookmarks.includes(userId)) return

    await databases.updateDocument(
      databaseId,
      videoCollectionId,
      documentId,
      {
        bookmarks: [...doc.bookmarks, userId]
      }
    )

  } catch (error) {
    throw Error(error)
  }
}

export const unBookmarkPost = async (documentId, userId) => {
  try {
    const doc = await databases.getDocument(
      databaseId,
      videoCollectionId,
      documentId
    )

    const newBookmarks = doc.bookmarks.filter(bookmark => bookmark !== userId)
    await databases.updateDocument(
      databaseId,
      videoCollectionId,
      documentId,
      {
        bookmarks: newBookmarks
      }
    )

  } catch (error) {
    throw Error(error)
  }
}

export const getUserBookmarkPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt')]
    )

    const documents = posts.documents
    const bookmarkPosts = []
    documents.map(document => {
      if (document.bookmarks.includes(userId)) {
        bookmarkPosts.push(document)
      }
    })

    if (!bookmarkPosts) throw Error

    return bookmarkPosts
  } catch (error) {
    throw new Error(error)
  }
}

export const searchBookmarkPosts = async (userId, query) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt')]
    )

    const documents = posts.documents
    const bookmarkPosts = []
    documents.map(document => {
      if (document.bookmarks.includes(userId) && document.title.includes(query)) {
        bookmarkPosts.push(document)
      }
    })

    if (!bookmarkPosts) throw Error

    return bookmarkPosts
  } catch (error) {
    throw new Error(error)
  }
}