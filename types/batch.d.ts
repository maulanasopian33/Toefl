export type Batch = {
    idBatch : String,
    namaBatch: string,
    deskripsiBatch	: String,
    tanggalMulai: Date,
    tanggalSelesai: Date,
    batasMaksimalPeserta: String,
    statusBatch	: String,
    intruksiKhusus	: String
};

export type BatchRes = {
    data? : Batch[],
    message : string,
    status : boolean
};