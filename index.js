const axios = require("axios");
const FormData = require("form-data");
const example = require("./example.json");

require("dotenv").config();

const { FB_USER, FB_PASS, FB_COLLECTION, FB_URL } = process.env;

function main() {
  getFunnelbackRecord(example.key);
  //createorUpdateFunnelbackRecord(example);
  //deleteFunnelbackRecord(example.key);
}

async function getFunnelbackRecord(key) {
  const url = `${FB_URL}/push-api/v2/collections/${FB_COLLECTION}/documents?key=${key}`;
  const auth = {
    username: FB_USER,
    password: FB_PASS,
  };

  try {
    const { data } = await axios.get(url, { auth });
    console.log(data);
  } catch (error) {
    console.error("Error deleting record:", error);
  }
}

async function createorUpdateFunnelbackRecord({ content, metaData, key }) {
  const url = `${FB_URL}/push-api/v2/collections/${FB_COLLECTION}/documents/content-and-metadata?key=${key}`;

  const form = new FormData();
  form.append("content", content, {
    filename: "content.html",
    contentType: "text/html",
  });
  form.append("metadata", JSON.stringify(metaData), {
    filename: "metadata.json",
    contentType: "application/json",
  });

  try {
    const { data } = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(),
        "Content-Type": `multipart/mixed; boundary=${form.getBoundary()}`,
        Authorization:
          "Basic " + Buffer.from(FB_USER + ":" + FB_PASS).toString("base64"),
      },
    });
    console.log({ data });
  } catch {
    console.log({ key });
  }
}

async function deleteFunnelbackRecord(key) {
  const url = `${FB_URL}/push-api/v2/collections/${FB_COLLECTION}/documents?key=${key}`;
  const auth = {
    username: FB_USER,
    password: FB_PASS,
  };
  try {
    const response = await axios.delete(url, { auth });
    console.log(response.data);
  } catch (error) {
    console.error("Error deleting record:", error);
  }
}

main();
