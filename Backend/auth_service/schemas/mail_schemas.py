import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

class Mail():

    def __init__(self, smtp_host='smtp.gmail.com', smtp_port=587,
                 smtp_username='eqmonitoring.14@gmail.com',
                 smtp_password='hevl wiar rwaw tnby'):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.smtp_username = smtp_username
        self.smtp_password = smtp_password

        # Thay bằng URL logo thực tế của bạn (ảnh host công khai)
        self.logo_url = 'https://i.postimg.cc/0jQQ6zzv/logo.png'

    def _build_html(self, title, message, content):
        return f"""
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin:0;padding:0;background:#f0f8ff;font-family:'Segoe UI',sans-serif;">
        <center>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#C6E7FF;border-radius:20px;padding:20px 10px;">
                    <tr>
                    <td align="center" style="background:#ffffff;border-top-left-radius:20px;border-top-right-radius:20px;padding:20px 0;">
                        <img src="{self.logo_url}" alt="Road Vision Logo"
                            style="max-height:90px;width:auto;display:block;" />
                    </td>
                    </tr>

                    <tr>
                    <td align="center" style="background:#eff4ff;border-bottom-left-radius:20px;border-bottom-right-radius:20px;box-shadow:0 5px 10px rgba(0,0,0,0.08);padding:20px;">
                        <h2 style="color:#1f4e79;margin:10px 0 15px;">{title}</h2>
                        <p style="font-size:14px;color:#333;margin:0 0 15px;">{message}</p>
                        <p style="font-size:16px;color:#FF414D;font-weight:bold;margin:0 0 20px;">{content}</p>

                        <table width="100%" cellpadding="0" cellspacing="0" style="background:#002e76;border-radius:12px;">
                        <tr>
                            <td align="center" style="padding:12px 10px;color:#fff;font-size:12px;">
                            <p style="margin:0;">Được gửi từ <strong>Road Vision – Hệ thống cảnh báo chất lượng đường bộ</strong></p>
                            <p style="margin:5px 0 0;">&copy; 2025 Road Vision</p>
                            </td>
                        </tr>
                        </table>
                    </td>
                    </tr>

                </table>
                </td>
            </tr>
            </table>
        </center>
        </body>
        </html>
        """

    def _send(self, MailTo, subject, title, message, content):
        email = MIMEMultipart('alternative')  # Chỉ chứa HTML, không đính kèm ảnh
        email['From'] = self.smtp_username
        email['To'] = MailTo
        email['Subject'] = subject

        html = self._build_html(title, message, content)
        email.attach(MIMEText(html, 'html'))

        try:
            server = smtplib.SMTP(self.smtp_host, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            server.send_message(email)
            server.quit()
        except Exception as ex:
            print('Error sending email:', str(ex))

    def sendOTP(self, MailTo, OTP):
        self._send(
            MailTo,
            'OTP VERIFICATION',
            'OTP Verification Code',
            'You have requested to verify your account. Your OTP code is:',
            OTP
        )

    def sendNewPass(self, MailTo, newPassword):
        self._send(
            MailTo,
            'NEW PASSWORD',
            'Your New Password',
            'You have just requested a password reset. Your new password is:',
            newPassword
        )

    def sendNotification(self, MailTo, Content):
        self._send(
            MailTo,
            'ALERT NOTIFICATION!',
            'New Road Quality Alert!',
            '<strong>Road Vision</strong> detected a road issue. Check the area below:',
            Content
        )