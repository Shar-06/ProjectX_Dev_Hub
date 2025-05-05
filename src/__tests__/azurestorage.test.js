describe('Azure Blob Storage Client', () => {
    const OLD_ENV = process.env;
  
    beforeEach(() => {
      jest.resetModules();
      process.env = { ...OLD_ENV };
    });
  
    afterAll(() => {
      process.env = OLD_ENV;
    });
  

  
    test('creates blobServiceClient and containerClient when connection string is set', () => {
      process.env.AZURE_STORAGE_CONNECTION_STRING = 'UseDevelopmentStorage=true';
  
      jest.resetModules();
      jest.mock('@azure/storage-blob', () => {
        return {
          BlobServiceClient: {
            fromConnectionString: jest.fn(() => ({
              getContainerClient: jest.fn(() => 'mockContainerClient'),
            })),
          },
        };
      });
  
      const { blobServiceClient, containerClient } = require('../config/azureStorage');
      const { BlobServiceClient } = require('@azure/storage-blob');
  
      expect(BlobServiceClient.fromConnectionString).toHaveBeenCalledWith('UseDevelopmentStorage=true');
      expect(blobServiceClient.getContainerClient).toHaveBeenCalledWith('report-images');
      expect(containerClient).toBe('mockContainerClient');
    });
  });
  