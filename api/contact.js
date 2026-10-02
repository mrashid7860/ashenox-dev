import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = 'ashenox7@gmail.com';

const FROM_EMAIL = 'Ashenox <info@ashenox.com>';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const { name, email, company, service, budget, message } = req.body || {};

    // --------------------------------------------------
    // 1. VALIDATE FORM
    // --------------------------------------------------

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and message are required.',
      });
    }

    // --------------------------------------------------
    // 2. GOOGLE SHEETS
    // --------------------------------------------------

    let googleSheetSuccess = false;
    let googleSheetError = null;

    try {
      const sheetResponse = await fetch(process.env.GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          company,
          service,
          budget,
          message,
        }),
      });

      const responseText = await sheetResponse.text();

      console.log('Google Sheets status:', sheetResponse.status);
      console.log('Google Sheets response:', responseText);

      let sheetResult;

      try {
        sheetResult = JSON.parse(responseText);
      } catch {
        throw new Error(`Google Sheets returned non-JSON response: ${responseText.slice(0, 300)}`);
      }

      if (!sheetResponse.ok) {
        throw new Error(sheetResult.message || `Google Sheets request failed with status ${sheetResponse.status}.`);
      }

      if (!sheetResult.success) {
        throw new Error(sheetResult.message || 'Google Sheets update failed.');
      }

      googleSheetSuccess = true;
    } catch (error) {
      googleSheetError = error?.message || 'Unknown Google Sheets error.';

      console.error('Google Sheets error:', googleSheetError);
    }

    // --------------------------------------------------
    // 3. AUTO-GENERATED TIMESTAMP
    // --------------------------------------------------

    const generatedAt = formatGeneratedDate();

    // --------------------------------------------------
    // 4. GOOGLE SHEETS STATUS FOR ADMIN EMAIL
    // --------------------------------------------------

    let sheetStatusHtml = '';

    if (!googleSheetSuccess) {
      sheetStatusHtml = `
        <div style="
          margin:24px 0 0;
          padding:18px;
          background:#fff5f4;
          border:1px solid #f0d0cc;
          border-radius:12px;
        ">
          <div style="
            color:#b42318;
            font-family:Arial,Helvetica,sans-serif;
            font-size:10px;
            font-weight:700;
            letter-spacing:1.1px;
            line-height:1.2;
            text-transform:uppercase;
          ">
            Google Sheets Update Failed
          </div>

          <div style="
            margin-top:8px;
            color:#7a271a;
            font-family:Arial,Helvetica,sans-serif;
            font-size:13px;
            line-height:1.6;
          ">
            ${escapeHtml(googleSheetError)}
          </div>
        </div>
      `;
    }

    // --------------------------------------------------
    // 5. ADMIN EMAIL
    // --------------------------------------------------

    const adminEmailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ashenox Contact Notification</title>
      </head>

      <body style="
        margin:0;
        padding:0;
        background:#eeeeeb;
        font-family:Arial,Helvetica,sans-serif;
      ">

        <div style="
          width:100%;
          padding:50px 16px;
          box-sizing:border-box;
          background:#eeeeeb;
        ">

          <div style="
            width:100%;
            max-width:620px;
            margin:0 auto;
            background:#ffffff;
            border:1px solid #deded9;
            border-radius:20px;
            overflow:hidden;
          ">

            <!-- HEADER -->

            <div style="
              padding:30px;
              background:#050505;
            ">

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>

                  <td>
                    <div style="
                      color:#ffffff;
                      font-size:24px;
                      font-weight:700;
                      letter-spacing:-1px;
                    ">
                      ASHENOX
                    </div>

                    <div style="
                      margin-top:7px;
                      color:#888884;
                      font-size:10px;
                      letter-spacing:1.2px;
                      text-transform:uppercase;
                    ">
                      Contact Notification
                    </div>
                  </td>

                  <td
                    align="right"
                    valign="top"
                  >
                    <div style="
                      display:inline-block;
                      padding:7px 10px;
                      border:1px solid #333333;
                      border-radius:20px;
                      color:#bcbcb8;
                      font-size:9px;
                      letter-spacing:1px;
                      text-transform:uppercase;
                    ">
                      New Inquiry
                    </div>
                  </td>

                </tr>
              </table>

            </div>


            <!-- INTRO -->

            <div style="
              padding:34px 30px 24px;
            ">

              <div style="
                color:#999994;
                font-size:10px;
                font-weight:700;
                letter-spacing:1.2px;
                text-transform:uppercase;
              ">
                New contact request
              </div>

              <div style="
                margin-top:10px;
                color:#111111;
                font-size:28px;
                font-weight:500;
                letter-spacing:-1.2px;
                line-height:1.05;
              ">
                ${escapeHtml(name)}
                <span style="color:#a0a09b;">
                  sent an inquiry.
                </span>
              </div>

              <div style="
                margin-top:14px;
                color:#777772;
                font-size:12px;
                line-height:1.6;
              ">
                A new contact form submission has been received
                through the Ashenox website.
              </div>

            </div>


            <!-- CONTACT DETAILS -->

            <div style="
              padding:8px 30px 0;
            ">

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="border-collapse:collapse;"
              >

                <!-- ROW 1 -->

                <tr>

                  <td
                    width="50%"
                    valign="top"
                    style="
                      padding:16px 14px 16px 0;
                      border-bottom:1px solid #e8e8e5;
                    "
                  >

                    <div style="
                      margin-bottom:6px;
                      color:#8a8a86;
                      font-size:10px;
                      font-weight:700;
                      letter-spacing:1.2px;
                      text-transform:uppercase;
                    ">
                      Full Name
                    </div>

                    <div style="
                      color:#171717;
                      font-size:14px;
                      line-height:1.5;
                    ">
                      ${escapeHtml(name)}
                    </div>

                  </td>


                  <td
                    width="50%"
                    valign="top"
                    style="
                      padding:16px 0 16px 14px;
                      border-bottom:1px solid #e8e8e5;
                    "
                  >

                    <div style="
                      margin-bottom:6px;
                      color:#8a8a86;
                      font-size:10px;
                      font-weight:700;
                      letter-spacing:1.2px;
                      text-transform:uppercase;
                    ">
                      Email Address
                    </div>

                    <div style="
                      color:#171717;
                      font-size:14px;
                      line-height:1.5;
                      word-break:break-word;
                    ">
                      ${escapeHtml(email)}
                    </div>

                  </td>

                </tr>


                <!-- ROW 2 -->

                <tr>

                  <td
                    width="50%"
                    valign="top"
                    style="
                      padding:16px 14px 16px 0;
                      border-bottom:1px solid #e8e8e5;
                    "
                  >

                    <div style="
                      margin-bottom:6px;
                      color:#8a8a86;
                      font-size:10px;
                      font-weight:700;
                      letter-spacing:1.2px;
                      text-transform:uppercase;
                    ">
                      Company / Website
                    </div>

                    <div style="
                      color:#171717;
                      font-size:14px;
                      line-height:1.5;
                    ">
                      ${escapeHtml(company || 'Not provided')}
                    </div>

                  </td>


                  <td
                    width="50%"
                    valign="top"
                    style="
                      padding:16px 0 16px 14px;
                      border-bottom:1px solid #e8e8e5;
                    "
                  >

                    <div style="
                      margin-bottom:6px;
                      color:#8a8a86;
                      font-size:10px;
                      font-weight:700;
                      letter-spacing:1.2px;
                      text-transform:uppercase;
                    ">
                      Service
                    </div>

                    <div style="
                      color:#171717;
                      font-size:14px;
                      line-height:1.5;
                    ">
                      ${escapeHtml(service || 'Not provided')}
                    </div>

                  </td>

                </tr>


                <!-- ROW 3 -->

                <tr>

                  <td
                    width="50%"
                    valign="top"
                    style="
                      padding:16px 14px 16px 0;
                    "
                  >

                    <div style="
                      margin-bottom:6px;
                      color:#8a8a86;
                      font-size:10px;
                      font-weight:700;
                      letter-spacing:1.2px;
                      text-transform:uppercase;
                    ">
                      Estimated Budget
                    </div>

                    <div style="
                      color:#171717;
                      font-size:14px;
                      line-height:1.5;
                    ">
                      ${escapeHtml(budget || 'Not provided')}
                    </div>

                  </td>


                  <td
                    width="50%"
                    valign="top"
                    style="
                      padding:16px 0 16px 14px;
                    "
                  >
                  </td>

                </tr>

              </table>

            </div>


            <!-- MESSAGE -->

            <div style="
              padding:16px 30px 0;
            ">

              <div style="
                margin-bottom:9px;
                color:#8a8a86;
                font-size:10px;
                font-weight:700;
                letter-spacing:1.2px;
                text-transform:uppercase;
              ">
                Message
              </div>

              <div style="
                padding:18px;
                background:#f6f6f3;
                border-radius:12px;
                color:#333333;
                font-size:14px;
                line-height:1.7;
                white-space:pre-wrap;
              ">
                ${escapeHtml(message)}
              </div>

            </div>


            <!-- GOOGLE SHEETS FAILURE -->

            ${sheetStatusHtml}


            <!-- REPLY BUTTON -->

            <div style="
              padding:28px 30px 32px;
            ">

              <a
                href="${createReplyLink(email)}"
                style="
                  display:inline-block;
                  padding:14px 20px;
                  background:#050505;
                  border-radius:9px;
                  color:#ffffff;
                  font-size:11px;
                  font-weight:700;
                  letter-spacing:.5px;
                  text-decoration:none;
                "
              >
                Reply to Client&nbsp;&nbsp;↗
              </a>

            </div>


            <!-- FOOTER -->

            <div style="
              padding:22px 30px 24px;
              background:#fafaf8;
              border-top:1px solid #eeeeea;
              text-align:center;
            ">

              <div style="
                color:#999994;
                font-size:10px;
                line-height:1.6;
              ">
                This notification was automatically generated on
                ${escapeHtml(generatedAt)} IST.
              </div>

              <div style="
                margin-top:10px;
                color:#111111;
                font-size:10px;
                font-weight:700;
                letter-spacing:1px;
              ">
                © ${new Date().getFullYear()} ASHENOX. ALL RIGHTS RESERVED.
              </div>

            </div>

          </div>

        </div>

      </body>
      </html>
    `;

    // --------------------------------------------------
    // 6. SEND EMAIL TO ADMIN
    // --------------------------------------------------

    let adminEmailSuccess = false;

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        replyTo: email,
        subject: `New Ashenox Inquiry — ${name}`,
        html: adminEmailHtml,
      });

      adminEmailSuccess = true;
    } catch (error) {
      console.error('Admin email error:', error?.message || error);
    }

    // --------------------------------------------------
    // 7. CUSTOMER THANK-YOU EMAIL
    // --------------------------------------------------

    const customerEmailHtml = `
      <!DOCTYPE html>
      <html lang="en">

      <head>
        <meta charset="UTF-8">
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >
        <title>Thank You — Ashenox</title>
      </head>

      <body style="
        margin:0;
        padding:0;
        background:#eeeeeb;
        font-family:Arial,Helvetica,sans-serif;
      ">

        <div style="
          width:100%;
          padding:50px 16px;
          box-sizing:border-box;
          background:#eeeeeb;
        ">

          <div style="
            width:100%;
            max-width:600px;
            margin:0 auto;
            background:#ffffff;
            border:1px solid #deded9;
            border-radius:20px;
            overflow:hidden;
          ">


            <!-- HEADER -->

            <div style="
              padding:36px 30px;
              background:#050505;
              text-align:center;
            ">

              <!--
                Replace this image URL with your actual
                Ashenox logo URL once you have one.
              -->

              <img
                src="https://aashushrink.com/wp-content/uploads/2025/12/Aashu-Shrink-Logo-Tagline-1024x312.png"
                alt="Ashenox"
                width="100"
                height="50"
                style="
                  display:block;
                  width:100px;
                  height:50px;
                  object-fit:contain;
                  margin:0 auto;
                  border:0;
                "
              >

              <div style="
                margin-top:10px;
                color:#fff;
                font-size:10px;
                letter-spacing:1.3px;
                text-transform:uppercase;
              ">
                Thank you for reaching out
              </div>

            </div>


            <!-- BODY -->

            <div style="
              padding:48px 30px 42px;
              text-align:center;
            ">

              <!-- CHECK ICON -->

              <div style="
                width:52px;
                height:52px;
                margin:0 auto;
                background:#050505;
                border-radius:50%;
                text-align:center;
                line-height:52px;
                color:#ffffff;
                font-size:21px;
              ">
                ✓
              </div>


              <!-- GREETING -->

              <div style="
                margin-top:28px;
                color:#111111;
                font-size:34px;
                font-weight:500;
                letter-spacing:-1.5px;
                line-height:1;
              ">
                Thanks, ${escapeHtml(name)}.
              </div>


              <!-- MESSAGE 1 -->

              <div style="
                max-width:440px;
                margin:20px auto 0;
                color:#666661;
                font-size:14px;
                line-height:1.8;
              ">
                Thank you for taking the time to reach out to
                Ashenox. We've received your message and
                appreciate the opportunity to learn more
                about your project.
              </div>


              <!-- MESSAGE 2 -->

              <div style="
                max-width:430px;
                margin:14px auto 0;
                color:#666661;
                font-size:14px;
                line-height:1.8;
              ">
                Our team will carefully review your inquiry
                and get back to you with the next steps
                as soon as possible.
              </div>


              <!-- DIVIDER -->

              <div style="
                width:42px;
                height:1px;
                margin:32px auto;
                background:#d8d8d3;
              "></div>


              <!-- MESSAGE 3 -->

              <div style="
                max-width:400px;
                margin:0 auto;
                color:#222222;
                font-size:13px;
                line-height:1.7;
              ">
                We look forward to hearing more about your
                vision and exploring what we can create
                together.
              </div>


              <!-- TALK SOON -->

              <div style="
                margin-top:28px;
                color:#999994;
                font-size:10px;
                font-weight:700;
                letter-spacing:1px;
                text-transform:uppercase;
              ">
                Talk soon
              </div>

            </div>


            <!-- FOOTER -->

            <div style="
              padding:26px 30px 28px;
              background:#fafaf8;
              border-top:1px solid #eeeeea;
              text-align:center;
            ">
              <div style="
                color:#999994;
                font-size:10px;
                font-weight:700;
                letter-spacing:1px;
              ">
                © ${new Date().getFullYear()} ASHENOX. ALL RIGHTS RESERVED.
              </div>

            </div>

          </div>

        </div>

      </body>
      </html>
    `;

    // --------------------------------------------------
    // 8. SEND THANK-YOU EMAIL TO CUSTOMER
    // --------------------------------------------------

    let customerEmailSuccess = false;

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Thanks for contacting Ashenox',
        html: customerEmailHtml,
      });

      customerEmailSuccess = true;
    } catch (error) {
      console.error('Customer email error:', error?.message || error);
    }

    // --------------------------------------------------
    // 9. FINAL RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      googleSheetSuccess,
      adminEmailSuccess,
      customerEmailSuccess,
    });
  } catch (error) {
    console.error('Contact API error:', error?.message || error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while submitting the form.',
    });
  }
}

// ======================================================
// HELPERS
// ======================================================

function escapeHtml(value = '') {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function createReplyLink(email) {
  const subject = encodeURIComponent('Re: Your Ashenox Inquiry');

  return `mailto:${encodeURIComponent(email)}?subject=${subject}`;
}

function formatGeneratedDate() {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date());
}
