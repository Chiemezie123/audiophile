// MongoDB Database Cleanup Script
// This script removes old indexes and cleans up conflicting data

import { MongoClient } from 'mongodb';

// Database connection string - update with your actual connection string
const MONGODB_URI = 'mongodb://localhost:27017/audiophile'; // Update this with your actual URI

async function cleanupDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // 1. List all indexes to see what exists
    console.log('\n1. Current indexes:');
    const indexes = await usersCollection.indexes();
    console.log(indexes.map(index => ({ name: index.name, key: index.key })));
    
    // 2. Drop the problematic 'name_1' index if it exists
    try {
      await usersCollection.dropIndex('name_1');
      console.log('\n2. ✅ Successfully dropped name_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('\n2. ℹ️  name_1 index does not exist (already removed)');
      } else {
        console.log('\n2. ❌ Error dropping name_1 index:', error.message);
      }
    }
    
    // 3. Drop firstName_1 index if it exists (from when it was set to unique)
    try {
      await usersCollection.dropIndex('firstName_1');
      console.log('\n3. ✅ Successfully dropped firstName_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('\n3. ℹ️  firstName_1 index does not exist');
      } else {
        console.log('\n3. ❌ Error dropping firstName_1 index:', error.message);
      }
    }
    
    // 4. Drop lastName_1 index if it exists (from when it was set to unique)
    try {
      await usersCollection.dropIndex('lastName_1');
      console.log('\n4. ✅ Successfully dropped lastName_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('\n4. ℹ️  lastName_1 index does not exist');
      } else {
        console.log('\n4. ❌ Error dropping lastName_1 index:', error.message);
      }
    }
    
    // 5. Remove any documents with old 'name' field or null values
    const deleteResult = await usersCollection.deleteMany({
      $or: [
        { name: { $exists: true } },    // Documents with old 'name' field
        { firstName: null },            // Documents with null firstName
        { lastName: null },             // Documents with null lastName
        { firstName: { $exists: false } }, // Documents missing firstName
        { lastName: { $exists: false } }   // Documents missing lastName
      ]
    });
    
    console.log(`\n5. ✅ Cleaned up ${deleteResult.deletedCount} problematic documents`);
    
    // 6. Show remaining documents count
    const remainingCount = await usersCollection.countDocuments();
    console.log(`\n6. ℹ️  Remaining valid users: ${remainingCount}`);
    
    // 7. List final indexes
    console.log('\n7. Final indexes:');
    const finalIndexes = await usersCollection.indexes();
    console.log(finalIndexes.map(index => ({ name: index.name, key: index.key })));
    
    console.log('\n✅ Database cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

// Run the cleanup
cleanupDatabase().catch(console.error);
