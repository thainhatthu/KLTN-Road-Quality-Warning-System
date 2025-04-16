import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import os

class Mail():

    def __init__(self, smtp_host='smtp.gmail.com', smtp_port=587, smtp_username='eqmonitoring.14@gmail.com', smtp_password='hevl wiar rwaw tnby'):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.smtp_username = smtp_username
        self.smtp_password = smtp_password
        self.server = smtplib.SMTP(smtp_host, smtp_port)

    def _build_html(self, message_title, message_body, code_or_content, cid='logo_image'):
        return f"""
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin: 0; padding: 0; background-color: #f0f8ff;">
          <table width="600" cellspacing="0" cellpadding="0" align="center" style="padding: 20px; border-radius: 20px; background-color: #C6E7FF; font-family: 'Segoe UI', sans-serif;">
            <tr>
              <td align="center" style="background-color: #ffffff; padding: 20px 0; border-top-left-radius: 20px; border-top-right-radius: 20px;">
                <img src="cid:{cid}" alt="Road Vision Logo" height="64" style="display: block;" />
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 10px 30px 0 30px;">
                <h2 style="color: #1f4e79; margin: 0;">{message_title}</h2>
              </td>
            </tr>
            <tr>
              <td align="left" style="padding: 15px 30px;">
                <p style="font-size: 15px; color: #333;">{message_body}</p>
                <p style="font-size: 18px; color: #FF414D; font-weight: bold; margin-top: 15px;">{code_or_content}</p>
                <p style="margin-top: 20px;">Trân trọng,<br>Đội ngũ Road Vision</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 0 30px 30px 30px;">
                <table width="100%" style="background-color: #002e76; border-radius: 12px;">
                  <tr>
                    <td align="center" style="padding: 15px; font-size: 12px; color: #ffffff;">
                      <p style="margin: 0;">Được gửi từ <strong>Road Vision – Hệ thống cảnh báo chất lượng đường bộ</strong></p>
                      <p style="margin: 5px 0 0 0;">&copy; 2025 Road Vision</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """

    def _attach_image(self, message, image_path, cid='logo_image'):
        if os.path.exists(image_path):
            with open(image_path, 'rb') as img_file:
                mime_image = MIMEImage(img_file.read())
                mime_image.add_header('Content-ID', f'<{cid}>')
                mime_image.add_header('Content-Disposition', 'inline', filename=os.path.basename(image_path))
                message.attach(mime_image)

    def sendOTP(self, MailTo, OTP, image_path='assets/logo.png'):
        message = MIMEMultipart('related')
        message['From'] = self.smtp_username
        message['To'] = MailTo
        message['Subject'] = 'OTP XÁC THỰC'
        html = self._build_html('Mã xác thực OTP', 'Bạn đang yêu cầu xác thực bằng mã OTP.', OTP)
        message.attach(MIMEText(html, 'html'))
        self._attach_image(message, image_path)
        try:
            self.server.starttls()
            self.server.login(self.smtp_username, self.smtp_password)
            self.server.send_message(message)
            self.server.quit()
        except Exception as ex:
            print('Error sending OTP mail: ', str(ex))

    def sendNewPass(self, MailTo, newPassword, image_path='assets/logo.png'):
        message = MIMEMultipart('related')
        message['From'] = self.smtp_username
        message['To'] = MailTo
        message['Subject'] = 'MẬT KHẨU MỚI'
        html = self._build_html('Mật khẩu mới', 'Bạn vừa yêu cầu đặt lại mật khẩu.', newPassword)
        message.attach(MIMEText(html, 'html'))
        self._attach_image(message, image_path)
        try:
            self.server.starttls()
            self.server.login(self.smtp_username, self.smtp_password)
            self.server.send_message(message)
            self.server.quit()
        except Exception as ex:
            print('Error sending new password mail: ', str(ex))

    def sendNotification(self, MailTo, Content, image_path='assets/logo.png'):
        message = MIMEMultipart('related')
        message['From'] = self.smtp_username
        message['To'] = MailTo
        message['Subject'] = 'THÔNG BÁO!'
        html = self._build_html(
            'Bạn có một lời nhắc từ hệ thống!',
            'Hệ thống <strong>Road Vision</strong> đã phát hiện một vấn đề tiềm ẩn về chất lượng mặt đường. Bạn vui lòng kiểm tra khu vực dưới đây để đảm bảo an toàn và kịp thời xử lý:',
            Content
        )
        message.attach(MIMEText(html, 'html'))
        self._attach_image(message, image_path)
        try:
            self.server.starttls()
            self.server.login(self.smtp_username, self.smtp_password)
            self.server.send_message(message)
            self.server.quit()
        except Exception as ex:
            print('Error sending notification mail: ', str(ex))