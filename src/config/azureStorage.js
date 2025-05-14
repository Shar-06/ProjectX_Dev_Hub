require('dotenv').config();

const { BlobServiceClient } = require('@azure/storage-blob');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw new Error('Azure storage connection string is not defined');
}
else console.log("Blob Storage connected succesfully");

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient('event-images');
module.exports = {
    blobServiceClient,
    containerClient,
    
};
