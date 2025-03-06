/**
 * Send registration confirmation emails
 */
export async function sendRegistrationEmails(registration: any) {
  try {
    const response = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registration),
    });

    if (!response.ok) {
      throw new Error("Failed to send emails");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending emails:", error);
    throw error;
  }
}
