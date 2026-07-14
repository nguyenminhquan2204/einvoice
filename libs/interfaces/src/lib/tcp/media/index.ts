export type UploadFileTcpRequest = {
  fileBase64: string;
  fileName: string;
};

export type UploadFileTcpResponse = {
  url: string;
  publicId: string;
};
