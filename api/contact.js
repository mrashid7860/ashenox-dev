import { Resend } from 'resend';

const ADMIN_EMAIL = 'ashenox7@gmail.com';
const FROM_EMAIL = 'Ashenox <info@ashenox.com>';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export default async function handler(req, res) {
  // ============================================================
  // 1. METHOD VALIDATION
  // ============================================================

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed.',
    });
  }

  try {
    // ============================================================
    // 2. CHECK SERVER CONFIGURATION
    // ============================================================

    if (!process.env.RESEND_API_KEY) {
      console.error('Contact API: RESEND_API_KEY is missing.');

      return res.status(500).json({
        success: false,
        message: 'Our email service is temporarily unavailable. Please try again later.',
      });
    }

    if (!process.env.GOOGLE_SHEET_WEBHOOK_URL) {
      console.error('Contact API: GOOGLE_SHEET_WEBHOOK_URL is missing.');
    }

    // ============================================================
    // 3. READ FORM DATA
    // ============================================================

    const { name, email, company, service, budget, message } = req.body || {};

    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim();
    const cleanCompany = String(company || '').trim();
    const cleanService = String(service || '').trim();
    const cleanBudget = String(budget || '').trim();
    const cleanMessage = String(message || '').trim();

    // ============================================================
    // 4. VALIDATE REQUIRED FIELDS
    // ============================================================

    if (!cleanName || !cleanEmail || !cleanCompany || !cleanService || !cleanBudget) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.',
      });
    }

    // ============================================================
    // 5. VALIDATE NAME
    // ============================================================

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters.',
      });
    }

    // ============================================================
    // 6. VALIDATE COMPANY
    // ============================================================

    if (cleanCompany.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Company name must be at least 2 characters.',
      });
    }

    // ============================================================
    // 7. VALIDATE EMAIL
    // ============================================================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Email address is not correct.',
      });
    }

    // ============================================================
    // 8. GOOGLE SHEETS
    // ============================================================

    let googleSheetSuccess = false;
    let googleSheetError = null;

    if (!process.env.GOOGLE_SHEET_WEBHOOK_URL) {
      googleSheetError = 'Google Sheets webhook URL is not configured.';
      console.error('Google Sheets:', googleSheetError);
    } else {
      try {
        const sheetResponse = await fetch(process.env.GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            company: cleanCompany,
            service: cleanService,
            budget: cleanBudget,
            message: cleanMessage,
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
          throw new Error(sheetResult?.message || `Google Sheets request failed with status ${sheetResponse.status}.`);
        }

        if (!sheetResult?.success) {
          throw new Error(sheetResult?.message || 'Google Sheets update failed.');
        }

        googleSheetSuccess = true;
      } catch (error) {
        googleSheetError = error instanceof Error ? error.message : 'Unknown Google Sheets error.';

        console.error('Google Sheets error:', googleSheetError);

        // IMPORTANT:
        // Google Sheets failure does NOT stop the inquiry.
      }
    }

    // ============================================================
    // 9. GENERATED TIMESTAMP
    // ============================================================

    const generatedAt = formatGeneratedDate();

    // ============================================================
    // 10. GOOGLE SHEETS STATUS FOR ADMIN EMAIL
    // ============================================================

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
            ${escapeHtml(googleSheetError || 'The inquiry could not be saved to Google Sheets.')}
          </div>
        </div>
      `;
    }

    // ============================================================
    // 11. ADMIN EMAIL HTML
    // ============================================================

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

            <div style="
              padding:30px;
              background:#050505;
            ">

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
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

                  <td align="right" valign="top">
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

            <div style="padding:34px 30px 24px;">

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
                ${escapeHtml(cleanName)}
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

            <div style="padding:8px 30px 0;">

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="border-collapse:collapse;"
              >

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
                      ${escapeHtml(cleanName)}
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
                      ${escapeHtml(cleanEmail)}
                    </div>

                  </td>

                </tr>

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
                      ${escapeHtml(cleanCompany)}
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
                      ${escapeHtml(cleanService)}
                    </div>

                  </td>

                </tr>

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
                      ${escapeHtml(cleanBudget)}
                    </div>

                  </td>

                  <td width="50%"></td>

                </tr>

              </table>

            </div>

            <div style="padding:16px 30px 0;">

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
                ${escapeHtml(cleanMessage || 'No message provided.')}
              </div>

            </div>

            ${sheetStatusHtml}

            <div style="padding:28px 30px 32px;">

              <a
                href="${createReplyLink(cleanEmail)}"
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

    // ============================================================
    // 12. SEND ADMIN EMAIL
    // ============================================================

    let adminEmailSuccess = false;
    let adminEmailError = null;

    try {
      const adminResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        replyTo: cleanEmail,
        subject: `New Ashenox Inquiry — ${cleanName}`,
        html: adminEmailHtml,
      });

      if (adminResult?.error) {
        throw new Error(adminResult.error.message || 'Admin email failed.');
      }

      adminEmailSuccess = true;
    } catch (error) {
      adminEmailError = error instanceof Error ? error.message : 'Unknown admin email error.';

      console.error('Admin email error:', adminEmailError);
    }

    // ============================================================
    // 13. ADMIN EMAIL IS CRITICAL
    // ============================================================

    if (!adminEmailSuccess) {
      return res.status(500).json({
        success: false,
        message: 'We could not send your inquiry right now. Please try again in a few moments or contact us by email.',
        googleSheetSuccess,
        adminEmailSuccess: false,
      });
    }

    // ============================================================
    // 14. CUSTOMER THANK-YOU EMAIL
    // ============================================================

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

            <div style="
              padding:36px 30px;
              background:#050505;
              text-align:center;
            ">

              <div style="
                color:#ffffff;
                font-size:24px;
                font-weight:700;
                letter-spacing:-1px;
              ">
                ASHENOX
              </div>

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

            <div style="
              padding:48px 30px 42px;
              text-align:center;
            ">

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

              <div style="
                margin-top:28px;
                color:#111111;
                font-size:34px;
                font-weight:500;
                letter-spacing:-1.5px;
                line-height:1;
              ">
                Thanks, ${escapeHtml(cleanName)}.
              </div>

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

              <div style="
                width:42px;
                height:1px;
                margin:32px auto;
                background:#d8d8d3;
              "></div>

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

    // ============================================================
    // 15. SEND CUSTOMER EMAIL
    // ============================================================

    let customerEmailSuccess = false;
    let customerEmailError = null;

    try {
      const customerResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: cleanEmail,
        subject: 'Thanks for contacting Ashenox',
        html: customerEmailHtml,
      });

      if (customerResult?.error) {
        throw new Error(customerResult.error.message || 'Customer email failed.');
      }

      customerEmailSuccess = true;
    } catch (error) {
      customerEmailError = error instanceof Error ? error.message : 'Unknown customer email error.';

      console.error('Customer email error:', customerEmailError);

      // Customer email failure does NOT invalidate the inquiry.
    }

    // ============================================================
    // 16. FINAL SUCCESS RESPONSE
    // ============================================================

    return res.status(200).json({
      success: true,
      message: 'Your inquiry has been received successfully.',
      googleSheetSuccess,
      adminEmailSuccess,
      customerEmailSuccess,
    });
  } catch (error) {
    // ============================================================
    // 17. GLOBAL FALLBACK
    // ============================================================

    console.error('Contact API error:', error instanceof Error ? error.message : error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while submitting the form. Please try again later.',
    });
  }
}

// ============================================================
// HELPERS
// ============================================================

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
