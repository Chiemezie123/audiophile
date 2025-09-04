import nodeMailer from "nodemailer";
import { convert } from "html-to-text";

interface User {
  email: string;
  name: string;
}

export class sendEmail {
  private to: string;
  private firstName: string;
  private url: string;
  private from: string;

  constructor(user: User, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `nduaguba chiemezie <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // sendgrid
      return nodeMailer.createTransport({
        service: "gmail",
        host: "stmp.gmail.com",
        secure: false,
        auth: {
          user: "anthonynduaguba123@gmail.com",
          pass: "jqqo vmau mvgq roin",
        },
      });
    }

    return nodeMailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "d586a3f9ecc028",
        pass: "83e138164373bd",
      },
    });
  }

  async send(template: string, subject: string) {
    // send the actual email
    // Note: Pug is commented out to avoid dependency issues
    // const html = pug.renderFile(
    //   `${__dirname}/../views/emails/${template}.pug`,
    //   {
    //     firstName: this.firstName,
    //     url: this.url,
    //     subject,
    //   }
    // );

    // Placeholder HTML for now - replace with your template logic
    const html = `<h1>Hello ${this.firstName}</h1><p>URL: ${this.url}</p>`;
    // render the HTML on a pub template
    // define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    // create a transport and send email
    const transport = this.newTransport();
    await transport.sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send(
      "welcome",
      `welcome to the natours family, dear ${this.firstName}`
    );
  }

  async sendPassword() {
    await this.send(
      "welcome",
      `welcome to the natours family, dear ${this.firstName}`
    );
  }
}

export class sendEmailForOtp {
  private to: string;
  private otp: string;
  private userName: string;
  private from: string;

  constructor(email: string, otp: string, userName: string | null = null) {
    this.to = email;
    this.otp = otp;
    this.userName = userName || email.split("@")[0]; // Use email prefix if no name provided
    this.from = `nduaguba chiemezie CEO <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Gmail configuration
      return nodeMailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com", // Fixed typo: was "stmp.gmail.com"
        secure: false,
        auth: {
          user: "anthonynduaguba123@gmail.com",
          pass: "jqqo vmau mvgq roin",
        },
      });
    }

    return nodeMailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "d586a3f9ecc028",
        pass: "83e138164373bd",
      },
    });
  }

  // Method to create HTML template inline (no external files needed)
  createOtpHtmlTemplate() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
                line-height: 1.6;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            
            .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
            }
            
            .content {
                padding: 40px 30px;
                text-align: center;
            }
            
            .greeting {
                font-size: 18px;
                color: #333;
                margin-bottom: 20px;
            }
            
            .message {
                font-size: 16px;
                color: #666;
                margin-bottom: 30px;
                line-height: 1.8;
            }
            
            .otp-container {
                background: #f8f9fa;
                border: 2px dashed #667eea;
                border-radius: 10px;
                padding: 25px;
                margin: 30px 0;
            }
            
            .otp-label {
                font-size: 14px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 10px;
            }
            
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                color: #667eea;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
            }
            
            .warning {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                color: #856404;
                font-size: 14px;
            }
            
            .footer {
                background: #f8f9fa;
                padding: 20px 30px;
                text-align: center;
                font-size: 14px;
                color: #666;
                border-top: 1px solid #eee;
            }
            
            .company-name {
                color: #667eea;
                font-weight: bold;
            }
            
            @media only screen and (max-width: 600px) {
                .container {
                    margin: 10px;
                    border-radius: 0;
                }
                
                .header, .content, .footer {
                    padding: 20px;
                }
                
                .otp-code {
                    font-size: 28px;
                    letter-spacing: 4px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Verification Required</h1>
                <p>Secure your account with OTP verification</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Hello ${this.userName}!
                </div>
                
                <div class="message">
                    We received a request to verify your account. Please use the One-Time Password (OTP) below to complete your verification process.
                </div>
                
                <div class="otp-container">
                    <div class="otp-label">Your OTP Code</div>
                    <div class="otp-code">${this.otp}</div>
                </div>
                
                <div class="warning">
                    ⚠️ <strong>Security Notice:</strong> This OTP is valid for 10 minutes only. Never share this code with anyone. If you didn't request this verification, please ignore this email.
                </div>
            </div>
            
            <div class="footer">
                <p>This email was sent by <span class="company-name">Audiophile</span></p>
                <p>If you have any questions, please contact our support team.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Method to send OTP email using inline HTML template (recommended)
  async sendOtp(subject: string = "Your OTP Verification Code") {
    try {
      const html = this.createOtpHtmlTemplate();

      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: convert(html),
      };

      const transport = this.newTransport();
      await transport.sendMail(mailOptions);

      console.log(`OTP email sent successfully to ${this.to}`);
      return { success: true, message: "OTP email sent successfully" };
    } catch (error) {
      console.error("Error sending OTP email:", error);
      throw error;
    }
  }
}
