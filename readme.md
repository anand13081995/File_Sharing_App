File Sharing App ====>


APIs---->
1. upload the file "/api/file" (Post)
2. Generate a sharable link for the file "/file/:fileId"
3. Downloadable link "/file/download/:fileId"
4. Send the sharable link on email

We will install multer "npm i multer" :--> used for uploading file in the form of "form-data"(in postman).

then create a folder named uploads in which we will upload the file bcz into database we can add only text base information.

use uuid "npm i uuid" to handle same name of file which will be uploaded.

install "npm i mongoose" => for store the new name and existing  name in database.

install nodemailer to share the file through mail => npm i nodemailer.

install "npm i dotenv"

push this code on github and then connect it to render.(On render click +New then click web service).
email sending will not work bcz render will unable to access SMTP of maildev. "So, handle it by yourself and learn"
check rest on postman with the new link of render.com