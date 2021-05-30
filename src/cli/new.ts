import fs from "node:fs";
import path from "node:path";

export default async function create(name: string) {
  const questions = [
    {
      type: "text",
      name: "projectID",
      message: "Application ID?"
    },
    {
      type: "text",
      name: "publicKey",
      message: "Public Key?"
    },
    {
      type: "text",
      name: "token",
      message: "Token?"
    },
    {
      type: "text",
      name: "devServerID",
      message: "Development Server ID?"
    }
  ];

  const promptName =
    name == null || fs.existsSync(path.join(process.cwd(), name));

  const response = await prompts(
    promptName
      ? [
          {
            type: "text",
            name: "name",
            message: "Project Name?",
            validate: value =>
              fs.existsSync(path.join(process.cwd(), value))
                ? "A folder with that name already exists"
                : true
          }
        ].concat(questions)
      : questions
  );

  const values = {
    ...response,
    directory: path.join(process.cwd(), response.name ?? name),
    version: package.version
  };

  console.log({ values });
}
