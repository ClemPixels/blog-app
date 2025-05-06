import { auth } from "../firebase.config"; // Import Firebase instance
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  where,
  query,
  updateDoc,
} from "firebase/firestore";

// Function to handle user signup
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("userCredentials: ", userCredential);
    return userCredential; // Return signed-up user
  } catch (error) {
    console.error("Error signing up: ", error.message);
    throw error; // Pass the error back to the component
  }
};

// Function to handle user login
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user; // Return logged-in user
  } catch (error) {
    console.error("Error Signing In: ", error.message);
    throw error; // Pass the error back to the component
  }
};

// Function to handle user logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error; // Pass the error back to the component
  }
};

export const db = getFirestore();

export const saveUserToDatabase = async (uid, userData) => {
  try {
    const userRef = doc(db, "users", uid); // Reference to Firestore document
    await setDoc(userRef, userData); // Save user data
    console.log("User details saved to Firestore:", userData); // Debugging log
  } catch (error) {
    console.error("Error saving user to Firestore:", error.message); // Log error
    throw error; // Pass the error back to the caller
  }
};

export const getUserDetails = async (uid) => {
  if (!uid) {
    console.error("UID is required to fetch user details.");
    return null; // Handle the case where UID is not provided
  }
  try {
    // Reference the user's document in the 'users' collection
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef); // Fetch the document

    if (userSnap.exists()) {
      return userSnap.data(); // Return the user data if it exists
    } else {
      console.error("No user data found for the specified UID");
      return null; // Handle the case where the user document does not exist
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error; // Propagate error to the caller
  }
};

export const fetchAllUsers = async () => {
  try {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Document ID
      ...doc.data(), // Document fields
    }));
    return users;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
};

export const addUserToDatabase = async (userData) => {
  try {
    const usersCollection = collection(db, "users");
    const docRef = await addDoc(usersCollection, userData); // Add user data
    const uid = docRef.id; // Use Firestore's auto-generated document ID as UID
    console.log("User added with UID:", uid);
    return uid;
  } catch (error) {
    console.error("Error adding user to Firestore:", error.message);
    throw error;
  }
};

export const addUserWithAuthentication = async (
  email,
  password,
  additionalData
) => {
  try {
    // Step 1: Add user to Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;

    // Step 2: Save additional details to Firestore
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, { uid, email, ...additionalData });

    console.log("User added to Firebase Auth and Firestore:", {
      uid,
      ...additionalData,
    });
    return { uid, email, ...additionalData }; // Return user details if needed
  } catch (error) {
    console.error("Error adding user with authentication:", error.message);
    throw error; // Throw error for the caller to handle
  }
};

export const deleteUserFromDatabase = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId); // Reference the user document
    await deleteDoc(userDocRef); // Delete document from Firestore
    console.log(`User with ID ${userId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting user:", error.message);
    throw error;
  }
};

// function to delete user and post from database

export const deleteUserAndPosts = async (userId) => {
  try {
    // Step 1: Delete the user's posts
    const postsRef = collection(db, "posts");
    const userPostsQuery = query(postsRef, where("createdBy", "==", userId));
    const postSnapshots = await getDocs(userPostsQuery);

    const deletePromises = postSnapshots.docs.map((postDoc) => {
      return deleteDoc(doc(db, "posts", postDoc.id));
    });

    await Promise.all(deletePromises);
    console.log(`Deleted ${postSnapshots.size} posts for user ${userId}`);

    // Step 2: Delete the user document
    await deleteDoc(doc(db, "users", userId));
    console.log(`Deleted user ${userId}`);
  } catch (err) {
    console.error("Failed to delete user and their posts:", err);
    throw err;
  }
};

//function to add post to Firestore
export const addPost = async (formData, userId) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      title: formData.title,
      body: formData.body,
      category: formData.category,
      thumbnail: formData.thumbnail,
      featured: formData.featured,
      createdBy: userId,
      createdAt: new Date(),
    });
    console.log("Post added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding post: ", error);
    throw error;
  }
};

// Function to fetch post
export const getPosts = async (userId) => {
  console.log("fetching posts for", userId);
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "posts"), where("createdBy", "==", userId))
    );
    if (querySnapshot.empty) {
      console.log("No posts found for this user.");
    }
    const userPosts = querySnapshot.docs.map((post) => ({
      id: post.id,
      ...post.data(),
    }));
    return userPosts;
  } catch (error) {
    console.log("Error fetching posts", error);
    return [];
  }
};

// get post by id
export const getPostById = async (postId) => {
  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) {
    throw new Error("Post not found");
  }

  const postData = postSnap.data();

  // Fetch the user data by userId
  const userRef = doc(db, "users", postData.createdBy);
  const userSnap = await getDoc(userRef);

  console.log("data returned:", {
    id: postSnap.id,
    ...postData,
    user: userSnap.exists()
      ? userSnap.data()
      : { username: "Unknown", avatar: "/default-avatar.png" },
  });

  return {
    id: postSnap.id,
    ...postData,
    user: userSnap.exists()
      ? userSnap.data()
      : { username: "Unknown", avatar: "/default-avatar.png" },
  };
};

export const updatePost = async (id, data) => {
  const docRef = doc(db, "posts", id);
  await updateDoc(docRef, data);
};

// Function to delete a post from Firestore
export const deletePost = async (postId) => {
  try {
    const postRef = doc(db, "posts", postId); // Reference to the category document
    await deleteDoc(postRef); // Delete the document
    console.log(`Post with ID ${postId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting post:", error.message);
    throw error; // Pass the error back to the caller
  }
};

// Function to add category to  Firestore
export const addCategory = async (
  categoryName,
  categoryDescription,
  userId
) => {
  try {
    const docRef = await addDoc(collection(db, "categories"), {
      name: categoryName,
      description: categoryDescription,
      createdBy: userId,
      createdAt: new Date(),
    });
    console.log("Category added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding category: ", e);
  }
};

// Function to fetch all categories from Firestore
export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Function to delete a category from Firestore
export const deleteCategory = async (categoryId) => {
  try {
    const categoryRef = doc(db, "categories", categoryId); // Reference to the category document
    await deleteDoc(categoryRef); // Delete the document
    console.log(`Category with ID ${categoryId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting category:", error.message);
    throw error; // Pass the error back to the caller
  }
};

// Function to update a category in Firestore
export const updateCategory = async (categoryId, updatedData) => {
  try {
    const categoryRef = doc(db, "categories", categoryId); // Reference to the category document
    await setDoc(categoryRef, updatedData, { merge: true }); // Update the document with new data
    console.log(`Category with ID ${categoryId} updated successfully.`);
  } catch (error) {
    console.error("Error updating category:", error.message);
    throw error; // Pass the error back to the caller
  }
};

// Function get all posts
export const getAllPosts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));

    const allPosts = await Promise.all(
      querySnapshot.docs.map(async (post) => {
        const postData = post.data();
        const userRef = doc(db, "users", postData.createdBy);
        const userSnap = await getDoc(userRef);

        const user = userSnap.exists()
          ? userSnap.data()
          : { name: "Unknown User", avatar: "" };

        return {
          id: post.id,
          ...postData,
          user, // Attach user details
        };
      })
    );

    return allPosts;
  } catch (error) {
    console.log("Error fetching posts", error);
    return [];
  }
};

// Upload image to cloudinary
export const uploadToCloudinary = async (file) => {
  const cloudName = "dv1nu9l6y";
  const uploadPreset = "blog-app-preset";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "blog-app-images");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  console.log("Cloudinary upload response:", data);

  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Image upload failed");
  }
  return data.secure_url;
};
