# Passport Office Clerk development checklist

Run `npm run doppler:dev`, open `/passport-office`, and choose **I'd like to apply for a passport!**.

1. Confirm the custom email/password form appears and no prebuilt Clerk screen is shown.
2. Submit a valid development-instance email and password; complete any Clerk security challenge if shown.
3. Confirm the email-code form appears, then enter the emailed code.
4. Confirm Clerk activates the new session and Stella shows the congratulations message.
5. Check invalid code, duplicate email, invalid password, resend, cancellation, and a blocked/failed security challenge show an error without leaving the office.
6. Confirm no passport is issued and guest Astro Pop checkout remains usable.

This checklist has not been executed against a real inbox by this PR.
