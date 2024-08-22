import * as FileSystem from 'expo-file-system';

const downloadFilesFromCollection = async (collection, folderName) => {
    try {
      // Define the directory path
      const directoryUri = FileSystem.documentDirectory + folderName;
  
      // Create the directory if it doesn't exist
      const { exists: directoryExists } = await FileSystem.getInfoAsync(directoryUri);
      if (!directoryExists) {
        await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
      }
  
      // Iterate over the content array
      for (const item of collection.content) {
        const { filename, link } = item;
        const fileUri = `${directoryUri}/${filename}`;
  
        // Check if the file already exists
        const { exists: fileExists } = await FileSystem.getInfoAsync(fileUri);
        if (fileExists) {
          console.log(`File ${filename} already exists, skipping download.`);
          continue;
        }
  
        // Download the file
        console.log(`Downloading ${filename}...`);
        const downloadResult = await FileSystem.downloadAsync(link, fileUri);
  
        if (downloadResult.status === 200) {
          console.log(`Downloaded ${filename} to ${downloadResult.uri}`);
        } else {
          console.error(`Failed to download ${filename}`);
        }
      }
  
      console.log('All downloads complete.');
    } catch (error) {
      console.error('Error downloading files:', error);
    }
  };

const saveFileToFolder = async (url, folderName, filename) => {
  try {
    const directoryUri = FileSystem.documentDirectory + folderName;

    const { exists } = await FileSystem.getInfoAsync(directoryUri);
    if (!exists) {
      await FileSystem.makeDirectoryAsync(directoryUri, {
        intermediates: true,
      });
    }

    const fileUri = directoryUri + "/" + filename;

    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      fileUri,
      {},
      (downloadProgress) => {
        const progress =
          downloadProgress.totalBytesWritten /
          downloadProgress.totalBytesExpectedToWrite;
        console.log(
          `Download progress for ${filename}: ${(
            progress * 100
          ).toFixed(2)}%`
        );
      }
    );

    const response = await downloadResumable.downloadAsync();

    return response.uri; // Return the URI for further use
  } catch (error) {
    console.error('Error downloading file:', error);
    return null;
  }
};

export {downloadFilesFromCollection}
