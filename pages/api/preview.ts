import { STRAPI_JWT } from "../../components/tina-strapi/tina-strapi-client";
const previewHandler = (req: any, res: any) => {
  const previewData = {
    strapi_jwt: req.cookies[STRAPI_JWT],
  };

  res.setPreviewData(previewData);
  res.status(200).end();
};

export default previewHandler;
