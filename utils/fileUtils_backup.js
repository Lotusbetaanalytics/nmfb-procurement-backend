const { url } = require('inspector');
const path = require('path');
const asyncHandler = require('../middleware/async');
const { ErrorResponseJSON } = require('./errorResponse');
const {token, rand} = require("./utils");
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

const accountName = "devrgblob"

const handleError = (err, res) => {
  res.status(500);
  res.render('error', { error: err });
};


const fileSizeLimit = 10*1024*1024

exports.sizeBelowLimitDepreciated = (res, file, sizeLimit=fileSizeLimit) => {
  if (file.size > sizeLimit) 
    return new ErrorResponseJSON(res, "File size above limit", 400);
  // else return false
}


exports.sizeBelowLimit = (size, limit = fileSizeLimit) => {
  if (size > limit)
    throw new SyntaxError("Size is Above the Limit") 
    // return false
  return true
}


exports.multerUploadConfig = multer({ storage: inMemoryStorage }).fields([{ name: 'files', maxCount: 3 }])


const getBlobNameDepreciated = (fileName, folderPath) => {
  const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
  return `${folderPath}${identifier}-${fileName}`;
};


const getBlobName = (fileName, folderPath, identifierLength = 10, strict = false) => {
  const extension = path.extname(fileName)  // get file extension
  const nameOnly = path.basename(fileName, extension)  // get file name without extension
  // console.log("name, extension, rand:", nameOnly, extension, rand());

  let identifier = token(identifierLength);
  if (strict) identifier = identifier.replace(/0\./, '');  // not needed
 
  return `${folderPath}${nameOnly}-${identifier}${extension}`;
};


const getBlobUrl = (accountName, containerName, blobName) => {
  let url = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`
  return url
}


const getFullFolderPath = (folderPath, parentDir = undefined) => {
  parentDir = parentDir? `${parentDir}/` : ""
  folderPath = folderPath? `${folderPath}/` : ""
  // console.log(parentDir, folderPath)
  let fullFolderPath = `${parentDir}${folderPath}`
  return fullFolderPath
}


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


exports.uploadDocument = async (req, project, files = undefined, folderPath = undefined, parentDir = undefined) => {
  /**
   * @summary
   *  upload a document and return the document url
   * 
   * @param req - request object
   * @param project - the project the files are being uploaded for
   * @param files - req.files or a similarly structured queryset
   * @param parentDir - parent directory
   * @param folderPath - path to the destination folder from the parent directory
   * 
   * @returns link to uploaded document
   */
  files = files ? files: req.files
  let title = project.title || project.projectTitle
  parentDir = parentDir ? parentDir : title
  console.log("files, parentDir, folderPath:", files, parentDir, folderPath)

  const links = await this.uploadBlob(req, files, folderPath, parentDir)
  return links
};


exports.uploadBlob = async (req, files = undefined, folderPath = undefined, parentDir = undefined) => {
  /**
   * @summary
   *  upload a blob and return the blob url
   * 
   * @param req - request object
   * @param files - req.files or a similarly structured queryset
   * @param parentDir - parent directory
   * @param folderPath - path to the destination folder from the parent directory
   * 
   * @returns array of uploaded blob links
   */
  let links = []
  files = files || req.files  // files = files? files: req.files

  let fullFolderPath = getFullFolderPath(folderPath, parentDir)
  // console.log("parentDir, folderPath, fullFolderPath:", parentDir, folderPath, fullFolderPath)

  if (!files) throw new ReferenceError(message = "There are no Files Provided for Upload")
  
  for (const [key, file] of Object.entries(files)) {
    this.sizeBelowLimit(file.size)  // check if file size is below the size limit

    let blobName = getBlobName(file.name, fullFolderPath);  // generate unique name for blob
    let blobService = new BlockBlobClient(process.env.AZURE_STORAGE_CONNECTION_STRING, containerName, blobName);

    // get file buffer
    let stream = getStream(file.data);
    let streamLength = file.data.length;

    let upload = await blobService.uploadStream(stream, streamLength)

    let link = getBlobUrl(accountName, containerName, blobName)  // get blob file url    
    links.push(link)
  }
  return links
};


exports.getBlobsDepreciated = async (req, res, next) => {
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
        inner_blobs = await listBlobs(blobs, blob.name);
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


exports.getBlobs = async (prefix = "", flat = false) => {
  /**
   * @summary
   *  get an object with container details and a formatted list of all blobs in a container or container subfolder
   * 
   * @param flat - specify if list of blobs should be flattened (Bool)
   * @param prefix - container folder or subfolder
   * 
   * @returns object with container details and blobs
   */
  let viewData;
  try{
    const containerClient = blobServiceClient.getContainerClient(containerName)
    // an array of blobs
    let allBlobs
    if (flat) {allBlobs = await flatListBlobs(containerClient)}
    else {allBlobs = await listBlobs(containerClient, prefix)}

    viewData = {
      title: 'Home',
      viewName: 'index',
      accountName: config.getStorageAccountName(),
      containerName: containerName,
      folderName: prefix,
      thumbnails: allBlobs || []
    };
    // console.log("containerClient: ", containerClient)
  }catch(err){
    viewData = {
      title: 'Error',
      viewName: 'error',
      message: 'There was an error contacting the blob storage container.',
      error: err
    };
    throw new ReferenceError(viewData.message)
  }
  console.log("viewData: ", viewData)
  return viewData
}


// exports.listBlob = async (containerClient, prefix) => {
async function listBlobs(containerClient, prefix = "") {
  /**
   * @summary
   *  get a list of all blobs in a container or container subfolder with their heirarchy
   *  using a container client
   * 
   * @param containerClient - azure blob service container client
   * @param prefix - container folder or subfolder
   * 
   * @returns list of blobs
   */
  let innerBlobs = await containerClient.listBlobsByHierarchy("/",  { prefix: prefix })
  let thumbnails = []
  for await (const innerBlob of innerBlobs) {
    // if blob represents a folder
    if (innerBlob.kind === "prefix") {
      innerBlob.thumbnails = []
      let list =  await listBlobs(containerClient, innerBlob.name)
      innerBlob.thumbnails = await innerBlob.thumbnails.concat(list) 
    }
    // append blob to thumbnails
    thumbnails.push(innerBlob);
  }
  return thumbnails
}

async function flatListBlobs(containerClient) {
  /**
   * @summary
   *  get a flattened list of all blobs in a container or container subfolder
   *  using a container client
   * 
   * @param containerClient - azure blob service container client
   * 
   * @returns list of blobs
   */
  let innerBlobs = await containerClient.listBlobsFlat()
  let thumbnails = []
  for await (const innerBlob of innerBlobs) 
    thumbnails.push(innerBlob)
  return thumbnails
}

