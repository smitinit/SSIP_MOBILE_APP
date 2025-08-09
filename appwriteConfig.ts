import { Client, Account, Databases } from "react-native-appwrite";
const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);

export const DB_ID = process.env.EXPO_PUBLIC_APPWRITE_DB!;
export const USERS_DETAILS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_USERS_DATA_COLLECTION_ID!;
