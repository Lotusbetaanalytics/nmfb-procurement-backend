const
    multer = require('multer')
  , inMemoryStorage = multer.memoryStorage()
  , uploadStrategy = multer({ storage: inMemoryStorage }).single('image')

  , { BlockBlobClient } = require('@azure/storage-blob')
  , getStream = require('into-stream')
  // , containerName = 'images'
  // , containerName = '$blobchangefeed'
  , containerName = 'testcontainer'

  // For get requests
  , blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING)
  , config = require('./storageConfig')
;


const handleError = (err, res) => {
  res.status(500);
  res.render('error', { error: err });
};


const getBlobName = originalName => {
  const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
  return `${identifier}-${originalName}`;
};


const uploadImage = (req, res) => {
  const
      blobName = getBlobName(req.file.originalname)
    , blobService = new BlockBlobClient(process.env.AZURE_STORAGE_CONNECTION_STRING,containerName,blobName)
    , stream = getStream(req.file.buffer)
    , streamLength = req.file.buffer.length
  ;
}


router.post('/', uploadStrategy, (req, res) => {

  const
        blobName = getBlobName(req.file.originalname)
      , blobService = new BlockBlobClient(process.env.AZURE_STORAGE_CONNECTION_STRING,containerName,blobName)
      , stream = getStream(req.file.buffer)
      , streamLength = req.file.buffer.length
  ;
  console.log(`
      blobName: ${blobName} \n
      blobService: ${blobService} \n
      stream: ${stream} \n
      streamLength: ${streamLength} \n
  `)
  blobService.uploadStream(stream, streamLength)
  .then(
      ()=>{
          res.render('success', { 
              message: 'File uploaded to Azure Blob storage.' 
          });
      }
  ).catch(
      (err)=>{
      if(err) {
          handleError(err, res);
          return;
      }
  })
});


// For get
router.get('/', async(req, res, next) => {
  let viewData;
  try{
    const blobs = blobServiceClient.getContainerClient(containerName).listBlobsFlat()
    viewData = {
      title: 'Home',
      viewName: 'index',
      accountName: config.getStorageAccountName(),
      containerName: containerName,
      thumbnails:[]
    };
    // for (const[key, item] of Object.entries(viewData)) {
    //   console.log(`viewData["${key}"]: ${viewData[key]}`)
    // }
    for await(let blob of blobs){
      viewData.thumbnails.push(blob);
    }
  
  }catch(err){
    viewData = {
      title: 'Error',
      viewName: 'error',
      message: 'There was an error contacting the blob storage container.',
      error: err
    };
    
    res.status(500);
  }
  res.render(viewData.viewName, viewData);
});