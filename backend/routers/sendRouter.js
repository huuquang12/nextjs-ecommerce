//Khởi tạo route POST xử lí khi send mail
app.post("/sendMail", async (req, res) => {
    var attachments; //Khởi tạo biến chứa các attachments
   
    //Khởi tạo đối tượng để gửi mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });
   
    //Trường hợp nếu có nhiều file được gửi về
    if (req.files.fileSend.length > 0) {
      //Gán giá trị vào biến attachments
      attachments = await req.files.fileSend.map(file => {
        return {
          filename: file.name,
          path: file.path
        };
      });
    }
   
    //Trường hợp nếu chỉ có 1 file
    if (req.files.fileSend.size > 0) {
      //Gán giá trị vào biến attachments
      attachments = [
        {
          filename: req.files.fileSend.name,
          path: req.files.fileSend.path
        }
      ];
    }
    //Lấy các giá trị từ fields như người nhận, tiêu đề, nội dung
    let { to, subject, text } = req.fields;
   
    //Chỉnh các giá tri của mail
    let mailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      text,
      attachments
    };
   
    //Tiến hành tạo Promise và gửi mail
    const sendMail = new Promise(function(resolve, reject) {
      transporter.sendMail(mailOptions, function(error, info) {
        //Kiểm tra lỗi
        if (error) {
          reject({
            msg:  error,
            type: "danger"
          });
        } else {
          resolve({
            msg: "Email sent: " + info.response,
            type: "success"
          });
        }
      });
    });
   
    //Tiến hành trả về thông báo 
    sendMail
      .then(result => {
        res.render("index", result);
      })
      .catch(err => {
        res.render("index", err);
      });
  });