import axios from "axios";

const BASE_URL = process.env.UAZAPI_BASE_URL;
const TOKEN = process.env.UAZAPI_INSTANCE_TOKEN;

export async function uazapiSendText({ phone, text }) {
  return axios.post(
    `${BASE_URL}/send/text`,
    {
      number: phone,
      text,
      linkPreview: false,
      async: true,
    },
    {
      headers: {
        token: TOKEN,
        "Content-Type": "application/json",
      },
    },
  );
}
