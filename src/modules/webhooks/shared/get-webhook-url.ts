export const getWebHookUrl = (url: string, params: object = null) => {
  if (!params) return url;

  let httpUrl = url;
  for (const propParam of Object.keys(params)) {
    httpUrl = httpUrl.replaceAll(`{${propParam}}`, params[propParam]);
  }

  return httpUrl;
};
