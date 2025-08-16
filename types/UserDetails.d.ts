export type ResUserDetail = {
    status : boolean,
    message : string,
    data? : detailUser[]
}

export type detailUser = {
    id : number,
    uid : string,
    namaLengkap : string,
    nim : string,
    fakultas : string,
    prodi : string,
    createdAt : string,
    updatedAt : string
}

export type ReqUserDetails = {
  namaLengkap: string;
  nim: string;
  fakultas: string;
  prodi: string;
  uid: string;
};