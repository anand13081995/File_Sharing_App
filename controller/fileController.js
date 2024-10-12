const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const path = require("path");
const FileModel = require("../model/fileModel");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const uploadFolderPath = "uploads";

const storage = multer.diskStorage({
  destination : (req, file, cb)=>cb(null, uploadFolderPath),
  filename : (req, file, cb)=>{
    console.log(file);
    //const filename = file.originalname;  //---> ok but can not handle same name of a file which will be uploaded.
    const filename = uuidv4() + path.extname(file.originalname); 
    cb(null, filename)
    }
})

const upload = multer({
    storage : storage,
    limits : {
        fileSize : 1024 * 1024 * 0.9 // Set to 0.9 MB
    }
}).single("attachment") //---> key name(attachment) which will pass through postman.


const uploadFile = (req, res)=>{
    upload(req, res, async(error)=>{
        if (error) {
            console.log(error);
            return res.status(400).json({
              success: false,
              message: "File size too large",
            });
          }

        console.log(req.file);
        const fileData = {
            originalName : req.file.originalname,
            newName : req.file.filename,
            size : req.file.size
        }

    const newlyInsertedFile = await FileModel.create(fileData);
    console.log(newlyInsertedFile);
        // console.log(req.body);
        res.json({
            success : true,
            message : "File uploaded Successfully",
            fileId : newlyInsertedFile._id
        })
    })
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const transporter = nodemailer.createTransport({
    host: "localhost",
    port: "1025",
    secure: false,
    auth: {
      username: "",
      password: ""
    }
  });


  const generateSharableLink = async (req, res) => {
    const sharableLink = `/files/download/${req.params.fileId}`;
    // Todo : Add basic fileid validations
    const fileData = await FileModel.findById(req.params.fileId);
    if (!fileData) {
      // File is not available for this ID
      return res.status(400).json({
        success: false,
        message: "Inavlid File ID",
      });
    }
    res.json({
      success: true,
      message: "Generate sharable link API",
      result: sharableLink,
    });
  };
  
  const downloadFile = async (req, res) => {
    const fileId = req.params.fileId;
    const fileData = await FileModel.findById(fileId);
    if (!fileData) {
      // File is not available for this ID
      return res.status(400).end("Invalid URL");
    }
    console.log(fileData);
    const path = `uploads/${fileData.newName}`;
    res.download(path, fileData.originalName);
  };
  
  const sendEmail = async (req, res) => {
    const fileId = req.body.fileId;
    const sharableLink = `${process.env.BASE_URL}/files/download/${fileId}`;
    // send mail
    const emailData = {
      to: req.body.email,
      from: "do-not-reply@filesharing.com",
      subject: "Your friend has shared a file with you!",
      html: `
          <p>
              Your friend has shared a file with you via filesharing app, please click the link to download the file <a target="_blank" href="${sharableLink}">Click Here</a>
          </p>
      `,
    };
    transporter.sendMail(emailData, (error, info) => {
      if (error) {
        console.log(error);
        return res.json({
          success: false,
          message: "Unable to send email",
          error: error,
        });
      }
      console.log(info);
      res.json({
        success: true,
        message: "Mail sent successfully",
      });
    });
  };




const fileController = {
    uploadFile,
    generateSharableLink,
    downloadFile,
    sendEmail
}

module.exports = fileController;