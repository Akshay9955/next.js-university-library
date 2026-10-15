import { Client as WorkflowClient } from "@upstash/workflow";
// import { Client as QStashClient, resend } from "@upstash/qstash";
import config from "@/lib/config";


export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});


import { Client, resend } from "@upstash/qstash";
import { email } from "zod";
const client = new Client({ token: config.env.upstash.qstashToken });

export const sendEmail = async ({ email, subject, message }: { email: string; subject: string; message: string }) => {
  await client.publishJSON({
    api: {
      name: "email",
      provider: resend({ token: config.env.resendToken }),
    },
    body: {
      from: "Akshay <email.kalabindu.com>",
      to: [email],
      subject,
      html: message,
    },
  });
}

