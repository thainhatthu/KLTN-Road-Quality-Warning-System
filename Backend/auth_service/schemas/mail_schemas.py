import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

class Mail():

    def __init__(self, smtp_host='smtp.gmail.com', smtp_port=587, smtp_username='cloudkeeper4@gmail.com', smtp_password='pygr pjpa cxht wgel'):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.smtp_username = smtp_username
        self.smtp_password = smtp_password
        self.server = smtplib.SMTP(smtp_host, smtp_port)

    def sendOTP(self, MailTo, OTP):
        message = MIMEMultipart()
        message['From'] = self.smtp_username
        message['To'] = MailTo
        message['Subject'] = 'OTP'
        body = f'OTP: {OTP}'
        message.attach(MIMEText(body, 'plain'))
        try:
            self.server.starttls()
            self.server.login(self.smtp_username, self.smtp_password)
            self.server.send_message(message)
            self.server.quit()
        except Exception as ex:
            print('Error sending OTP mail: ', str(ex))

    def sendNewPass(self, MailTo, newPassword):
        message = MIMEMultipart()
        message['From'] = self.smtp_username
        message['To'] = MailTo
        message['Subject'] = 'New Password'
        body = f'Your new password is: {newPassword}'
        message.attach(MIMEText(body, 'plain'))
        try:
            self.server.starttls()
            self.server.login(self.smtp_username, self.smtp_password)
            self.server.send_message(message)
            self.server.quit()
        except Exception as ex:
            print('Error sending new password mail: ', str(ex))

    def sendNotification(self, MailTo, Content):
        message = MIMEMultipart()
        message['From'] = self.smtp_username
        message['To'] = MailTo
        message['Subject'] = 'Bạn có một lời nhắc từ Plantaholic!'
        body = f'Nhắc nhở: {Content}'
        message.attach(MIMEText(body, 'plain'))
        try:
            self.server.starttls()
            self.server.login(self.smtp_username, self.smtp_password)
            self.server.send_message(message)
            self.server.quit()
        except Exception as ex:
            print('Error sending notification mail: ', str(ex))
