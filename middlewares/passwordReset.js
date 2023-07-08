const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
const Merchant = require(".././usermanagement/models/merchant.model");
const Token = require("../models/Token.models");
const gmailPassword = "dporbuwjfvvlnima";
const clientURL = "http://localhost:3000";
exports.requestPasswordReset = async (email) => {
  try {
    // console.log(req.body);
    let merchant = await Merchant.findOne({
      where: {
        email_address: email,
      },
    });
    if (!merchant) throw new Error("merchant does not exist");
    let token = await Token.findOne({
      where: { merchant_id: merchant.merchant_id },
    });
    if (token) await token.deleteOne();
    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(10));
    await Token.create({
      merchant_id: merchant.merchant_id,
      token: hash,
      createdAt: Date.now(),
    });

    const link = `${clientURL}/auth/resetpassword?token=${resetToken}&id=${merchant.merchant_id}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        merchant: "amaedris1@gmail.com",
        pass: gmailPassword,
      },
    });

    let subject = "Password Reset";
    let message = "here is the link to reset your password";

    var mailOptions = {
      from: "amaedris1@gmail.com",
      to: email,
      subject: subject,
      text: message + " " + link,
      //   html: "<a href={linnkUrl}>Reset Password</a>",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return link;
  } catch (error) {
    console.log(error);
  }
};

exports.resetPassword = async (merchantId, token, password) => {
  console.log(password);
  let passwordResetToken = await Token.findOne({
    where: { merchant_id: merchantId },
  });

  if (!passwordResetToken) {
    throw new Error("Invalid or expired password reset token");
  }

  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }
  const hash = await bcrypt.hash(password, Number(10));

  const merchant = await merchant.findOne({
    where: {
      merchant_id: merchantId,
    },
  });
  merchant.password = hash;
  await merchant.save();
  //   const merchant = await User.findById({ _id: userId });
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "amaedris1@gmail.com",
      pass: gmailPassword,
    },
  });

  let subject = "Password Reset";
  let message = "Congaratulation Your Password is successfully reseted";

  var mailOptions = {
    from: "amaedris1@gmail.com",
    to: user.email_address,
    subject: subject,
    text: message,
    //   html: "<a href={linnkUrl}>Reset Password</a>",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent: " + info.response);
    }
  });
  await passwordResetToken.destroy();
  return true;
};
exports.changePasswordServices = async (
  phone_number,
  old_password,
  new_password
) => {
  try {
    // console.log(req.body);
    let merchant = await Merchant.findOne({
      where: {
        phone_number: phone_number,
      },
    });
    if (!merchant) {
      let manager = await Manager.findOne({
        where: {
          phone_number: phone_number,
        },
      });
      if (!manager) {
        return { code: 0, message: "Manager Not Found" };
      } else {
        console.log(manager.password);
        const passwordIsValid = bcrypt.compareSync(
          old_password,
          manager.password
        );
        if (!passwordIsValid) {
          return { code: 1, message: "Old Password Does Not Match" };
        } else {
          console.log(manager.password);
          //   n: bcrypt.hashSync(defaultPassword.toString(), 8),
          manager.password = bcrypt.hashSync(new_password.toString(), 8);
          await manager.save();
          return { code: 2, message: "successfully updated" };
        }
      }
    } else {
      const passwordIsValid = bcrypt.compareSync(old_password, merchant.password);
      if (!passwordIsValid) {
        return { code: 1, message: "Old Password Does Not Match" };
      } else {
        user.password = bcrypt.hashSync(new_password.toString(), 8);
        await user.save();
        return { code: 2, message: "successfully updated" };
      }
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};
