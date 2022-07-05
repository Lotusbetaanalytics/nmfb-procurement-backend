const asyncHandler = require('../middleware/async');
const { ErrorResponseJSON } = require('./errorResponse');
const router = require("express").Router();

const
    multer = require('multer')
  , inMemoryStorage = multer.memoryStorage()
  , uploadStrategy = multer({ storage: inMemoryStorage }).single('image')

  , { BlockBlobClient, BlobServiceClient } = require('@azure/storage-blob')
  , getStream = require('into-stream')
  , containerName = 'testcontainer'

  // For get requests
  , blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING)
  , config = require('./storageConfig')
;

const account = "devrgblob"

const handleError = (err, res) => {
  res.status(500);
  res.render('error', { error: err });
};


const getBlobName = (fileName, folderPath) => {
  const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
  return `${folderPath}${identifier}-${fileName}`;
};


// const uploadImage = (req, res) => {
//   const
//       blobName = getBlobName(req.file.originalname)
//     , blobService = new BlockBlobClient(process.env.AZURE_STORAGE_CONNECTION_STRING,containerName,blobName)
//     , stream = getStream(req.file.buffer)
//     , streamLength = req.file.buffer.length
//   ;
// }


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


const fileSizeLimit = 10*1024*1024

exports.sizeBelowLimit = (res, file, sizeLimit=fileSizeLimit) => {
  if (file.size > sizeLimit) 
    return new ErrorResponseJSON(res, "File size above limit", 400);
  // else return false
}


exports.multerUploadConfig = multer({ storage: inMemoryStorage }).fields([{ name: 'files', maxCount: 3 }])


exports.uploadProjectDocuments = asyncHandler(async (req, res, project, files, folderPath) => {
  // files = req.file
  let links = []
  files = (files)? files: req.file // if files, files, else req.files
  console.log(files)
  for (const file in files) {

    this.sizeBelowLimit(res, file) // Check if file size below size limit and return error
      
    let fullFolderPath = "";
    if (folderPath) fullFolderPath = `${project.title}/${folderPath}/`;
    else fullFolderPath = `${project.title}/}`;

    let blobName = getBlobName(file, fullFolderPath);
    let blobService = new BlockBlobClient(process.env.AZURE_STORAGE_CONNECTION_STRING, containerName, blobName);
    let stream = getStream(req.file.buffer);
    let streamLength = req.file.buffer.length;

    let link = blobService
      .uploadStream(stream, streamLength)
      .then(() => res.render("success", {message: "File uploaded to Azure Blob storage."}))
      .catch(err => {
        if (err) {
          handleError(err, res);
          return;
        }
      });

    links.push(link)
  }
  return links
});


exports.uploadBlobDepreciated = async (req, res, files = undefined, folderPath = "test_folder", parentDir = undefined) => {
  let links = []
  files = (files)? files: req.files // if files, files, else req.files
  console.log(files)
  
  // for (const file in files) {
  for (const [key, file] of Object.entries(files)) {
    console.log(`key, file:`, key, file, `\n`)
    this.sizeBelowLimit(res, file) // Check if file size below size limit and return error
      
    let fullFolderPath = "";
    if (folderPath) fullFolderPath = `${parentDir}/${folderPath}/`;
    else fullFolderPath = `${parentDir}/}`;
    console.log(`full folder path`, fullFolderPath)

    let blobName = getBlobName(file, fullFolderPath);
    let blobService = new BlockBlobClient(process.env.AZURE_STORAGE_CONNECTION_STRING, containerName, blobName);
    let stream = getStream(req.file.buffer);
    let streamLength = req.file.buffer.length;

    let link = blobService
      .uploadStream(stream, streamLength)
      .then(() => res.render("success", {message: "File uploaded to Azure Blob storage."}))
      .catch(err => {
        if (err) {
          handleError(err, res);
          return;
        }
      });

    links.push(link)
  }
  return links
};


exports.uploadDocument = async (req, res, project, files = undefined, folderPath = null, parentDir = undefined) => {
  /**
   * project: the project the files are being uploaded for
   * files: req.files or a similarly structured queryset
   * parentDir: parent directory
   * folderPath: path to the destination folder from the parent directory
   */
  let links = []
  files = (files)? files: req.files  // if files, files, else req.files
  folderPath = folderPath ? folderPath : project.title  // if folderPath, folderPath, else project.title
  console.log("files, folderPath:", files, folderPath)

  if (!files) {
    console.log("files not found")
    return false
  }
  
  // for (const file in files) {
  for (const [key, file] of Object.entries(files)) {
    console.log(`key, file:`, key, file, `\n`)

    // print error if file size is above file size limit
    if (file.size > fileSizeLimit) console.log(`file above file limit`, fileSizeLimit)

    if (parentDir) {parentDir = `${parentDir}/`} else {parentDir = ""}
    if (folderPath) {folderPath = `${folderPath}/`} else {folderPath = ""}
      
    // let fullFolderPath = "";
    // if (folderPath) fullFolderPath = `${parentDir}/${folderPath}/`;
    // else fullFolderPath = `${parentDir}/}`;

    fullFolderPath = `${parentDir}${folderPath}`
    console.log(`full folder path`, fullFolderPath)

    let blobName = getBlobName(file.name, fullFolderPath);
    let blobService = new BlockBlobClient(process.env.AZURE_STORAGE_CONNECTION_STRING, containerName, blobName);
    // // There is no file.buffer
    // let stream = getStream(file.buffer);
    // let streamLength = file.buffer.length;
    let stream = getStream(file.data);
    let streamLength = file.data.length;
    console.log("blob details:", blobName, stream, streamLength)

    // let link = blobService
    //   .uploadStream(stream, streamLength)
    //   // .then(() => res.render("success", {message: "File uploaded to Azure Blob storage."}))
    //   .then(() => console.log("file uploaded to blob storage successfully"))
    //   .catch(err => {
    //     if (err) {
    //       handleError(err, res);
    //       return;
    //     }
    //   });

    let upload = await blobService.uploadStream(stream, streamLength)
    // let upload = await blobService.uploadFile(file)
    console.log("\n\n", upload, "\n\n")
    // generate uploaded file link
    let link = `https://${account}.blob.core.windows.net/${containerName}/${blobName}`
    console.log(link)
    
    links.push(link)
  }
  return links
};


exports.uploadBlob = async (req, res, files = undefined, folderPath = "test_folder", parentDir = undefined) => {
  /**
   * files: req.files or a similarly structured queryset
   * parentDir: parent directory
   * folderPath: path to the destination folder from the parent directory
   */
  let links = []
  files = (files)? files: req.files // if files, files, else req.files
  console.log(files)

  if (!files) {
    console.log("files not found")
    return false
  }
  
  // for (const file in files) {
  for (const [key, file] of Object.entries(files)) {
    console.log(`key, file:`, key, file, `\n`)

    // print error if file size is above file size limit
    if (file.size > fileSizeLimit) console.log(`file above file limit`, fileSizeLimit)

    if (parentDir) {parentDir = `${parentDir}/`} else {parentDir = ""}
    if (folderPath) {folderPath = `${folderPath}/`} else {folderPath = ""}
      
    // let fullFolderPath = "";
    // if (folderPath) fullFolderPath = `${parentDir}/${folderPath}/`;
    // else fullFolderPath = `${parentDir}/}`;

    fullFolderPath = `${parentDir}${folderPath}`
    console.log(`full folder path`, fullFolderPath)

    let blobName = getBlobName(file.name, fullFolderPath);
    let blobService = new BlockBlobClient(process.env.AZURE_STORAGE_CONNECTION_STRING, containerName, blobName);
    // // There is no file.buffer
    // let stream = getStream(file.buffer);
    // let streamLength = file.buffer.length;
    let stream = getStream(file.data);
    let streamLength = file.data.length;
    console.log("blob details:", blobName, stream, streamLength)

    // let link = blobService
    //   .uploadStream(stream, streamLength)
    //   // .then(() => res.render("success", {message: "File uploaded to Azure Blob storage."}))
    //   .then(() => console.log("file uploaded to blob storage successfully"))
    //   .catch(err => {
    //     if (err) {
    //       handleError(err, res);
    //       return;
    //     }
    //   });

    let upload = await blobService.uploadStream(stream, streamLength)
    // let upload = await blobService.uploadFile(file)
    console.log("\n\n", upload, "\n\n")
    // generate uploaded file link
    let link = `https://${account}.blob.core.windows.net/${containerName}/${blobName}`
    console.log(link)
    
    links.push(link)
  }
  return links
};


exports.getBlobs = async (req, res, next) => {
  let viewData;
  try{
    // const blobs = await blobServiceClient.getContainerClient(containerName).listBlobsFlat()
    // const blobs = await blobServiceClient.getContainerClient(containerName).listBlobsByHierarchy("/")
    // const blobs = await blobServiceClient.getContainerClient(containerName).listBlobsByHierarchy("/",  { prefix: "test_folder/" })
    const blobs = await blobServiceClient.getContainerClient(containerName).listBlobsByHierarchy("/",  { prefix: "" })
    viewData = {
      title: 'Home',
      viewName: 'index',
      accountName: config.getStorageAccountName(),
      containerName: containerName,
      thumbnails:[]
    };
    console.log(blobs)

    // for (const[key, item] of Object.entries(viewData)) {
    //   console.log(`viewData["${key}"]: ${viewData[key]}`)
    // }

    // for await(let blob of blobs){
    //   viewData.thumbnails.push(blob);
    // }

    for await(let blob of blobs){
      viewData.thumbnails.push(blob);
      if (blob.kind === "prefix") {
        // // console.log(`\tBlobPrefix: ${blob.name}`);
        // let innerData = {
        //   kind: 'prefix',
        //   name: `${blob.name}`,
        //   thumbnails:[]
        // };
        blob.thumbnails = []
        inner_blobs = await listblob(blobs, blob.name);
        // innerData.thumbnails.push(inner_blobs)
        blob.thumbnails.push(inner_blobs)

        // viewData.thumbnails.push(innerData);
        viewData.thumbnails.push(blob);
      } else {
        viewData.thumbnails.push(blob);
      }
      // viewData.thumbnails.push(blob);
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
  // console.log("viewData", viewData)
  // res.render(viewData.viewName, viewData);
  return viewData
}

async function listblob(containerClient, prefix) {
  // let iter1 = containerClient.listBlobsByHierarchy("/", { prefix: prefix });
  let iter1 = await blobServiceClient.getContainerClient(containerName).listBlobsByHierarchy("/",  { prefix: prefix })
  thumbnails = []
  for await (const item of iter1) {
    if (item.kind === "prefix") {
      console.log(`\tBlobPrefix: ${item.name}`);
      item.thumbnails = []
      let list =  await listblob(containerClient, item.name)
      await item.thumbnails.push(list) 
      console.log("item thumbnails:", item.thumbnails)
      thumbnails.push(item)
    } else {
      // console.log(`\tBlobItem: name - ${item.name}`);
      thumbnails.push(item);
    }
  }
  console.log("thumbnails:", thumbnails)
  return thumbnails
}

