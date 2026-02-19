# API Documentation - Presensi Backend

## Overview

Presensi Backend adalah sistem API untuk manajemen absensi pegawai dengan fitur pelacakan lokasi, manajemen shift, dan pemrosesan antrian.

**Base URL:** `http://localhost:4000` (default port) atau sesuai konfigurasi `PORT` di environment variables.

**Version:** `v1`

**Authentication:** JWT (JSON Web Token) dengan masa berlaku 12 jam.

---

## Table of Contents

1. [Authentication](#authentication)
2. [General Information](#general-information)
3. [Auth Endpoints](#auth-endpoints)
4. [Presensi Endpoints](#presensi-endpoints)
5. [Admin Endpoints](#admin-endpoints)
6. [Error Responses](#error-responses)
7. [Database Schema](#database-schema)
8. [Environment Variables](#environment-variables)

---

## Authentication

### How to Authenticate

API ini menggunakan JWT (JSON Web Token) untuk autentikasi. Token diperoleh dengan melakukan login menggunakan endpoint `/api/v1/auth/login`.

### Authorization Header

Setiap request yang memerlukan autentikasi harus menyertakan header:

```
Authorization: Bearer <token>
```

### Token Payload

Token JWT berisi informasi berikut:

```json
{
  "sub": "user_id",
  "idtbPegawai": "employee_id",
  "id_contact": "contact_id",
  "id_shift": "shift_id",
  "skpd": "agency_id",
  "jam_masuk": "scheduled_in_time",
  "jam_keluar": "scheduled_out_time",
  "typ": "pegawai",
  "iat": 1234567890,
  "exp": 1234603089
}
```

### Device Binding

Setiap pegawai terikat pada satu device ID. Pada login pertama, device ID akan didaftarkan secara otomatis. Login selanjutnya harus menggunakan device ID yang sama.

---

## General Information

### Supported Content Types

- `application/json`
- `multipart/form-data`
- `application/x-www-form-urlencoded`

### Rate Limiting

- **Limit:** 300 request per 15 menit
- **Error Response:** `429 Too Many Requests`

### CORS

CORS diaktifkan dan dapat dikonfigurasi melalui environment variable `CORS_ORIGIN`.

---

## Auth Endpoints

Base path: `/api/v1/auth`

### 1. Login

**Endpoint:** `POST /api/v1/auth/login`

Melakukan autentikasi dan mendapatkan token JWT.

#### Request

**Headers:**
```
Content-Type: application/json
atau
Content-Type: application/x-www-form-urlencoded
atau
Content-Type: multipart/form-data
```

**Body Parameters:**

| Parameter | Type   | Required | Description                                      |
|-----------|--------|----------|--------------------------------------------------|
| nip       | string | Yes      | NIP pegawai (atau gunakan `nipBaru`)            |
| device_id | string | Yes      | ID perangkat (alias: `deviceId`, `imei`)        |

**Body Examples:**

```json
// JSON
{
  "nip": "198001012000121001",
  "device_id": "abc123device"
}
```

```javascript
// Form Data
nip=198001012000121001&device_id=abc123device
```

#### Response

**Success (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "idtbPegawai": 123,
    "nipBaru": "198001012000121001",
    "namaPegawai": "John Doe",
    "skpd": "Dinas Komunikasi dan Informatika",
    "opd": "Dinas Komunikasi dan Informatika",
    "jabatan": "Staff"
  },
  "shift": {
    "id_shift": 1,
    "today": {
      "id_shift": 1,
      "hari": 1,
      "jam_masuk": "08:00:00",
      "jam_keluar": "16:00:00"
    },
    "detail": [
      {
        "id_shift": 1,
        "hari": 1,
        "jam_masuk": "08:00:00",
        "jam_keluar": "16:00:00"
      },
      // ... hari lainnya
    ]
  },
  "lokasiKantor": {
    "id": 1,
    "nama_lokasi": "Kantor Walikota",
    "lat": "-6.2088",
    "lng": "106.8456",
    "radius": 100
  }
}
```

**Error Responses:**

| Status | Code              | Description                                      |
|--------|-------------------|--------------------------------------------------|
| 400    | nip_and_device_id_are_required | Parameter nip atau device_id tidak lengkap |
| 401    | invalid_credentials | NIP tidak ditemukan                      |
| 401    | invalid_device    | Device ID tidak cocok dengan device terdaftar   |
| 500    | server_error      | Terjadi kesalahan server                         |

---

### 2. Get Profile

**Endpoint:** `GET /api/v1/auth/me`

Mengambil profil pegawai yang sedang login.

#### Request

**Headers:**
```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK):**

```json
{
  "profile": {
    "idtbPegawai": 123,
    "nipBaru": "198001012000121001",
    "idelektronik": 456,
    "namaPegawai": "John Doe",
    "jabatan": "Staff",
    "skpd": "Dinas Komunikasi dan Informatika",
    "shift": 1,
    "idKantor": 1,
    "device_id": "abc123device"
    // ... field lainnya dari tbPegawai
  }
}
```

**Error Responses:**

| Status | Code        | Description               |
|--------|-------------|---------------------------|
| 401    | unauthorized | Token tidak valid        |
| 404    | not_found   | Profil tidak ditemukan    |
| 500    | server_error| Terjadi kesalahan server  |

---

### 3. Check Token

**Endpoint:** `GET /api/v1/auth/check`

Memeriksa validitas token dan informasi kedaluwarsa.

#### Request

**Headers:**
```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK):**

```json
{
  "active": true,
  "exp": 1234603089,
  "expISO": "2026-02-19T12:34:56.000Z",
  "now": 1234567890,
  "remainingSeconds": 35199,
  "user": {
    "idtbPegawai": 123,
    "skpd": "Dinas Komunikasi dan Informatika"
  }
}
```

**Error Responses:**

| Status | Code        | Description               |
|--------|-------------|---------------------------|
| 401    | unauthorized | Token tidak valid/kadaluarsa |

---

### 4. Logout

**Endpoint:** `POST /api/v1/auth/logout`

Logout dari sistem (stateless, client harus menghapus token).

#### Request

**Headers:**
```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK):**

```json
{
  "ok": true
}
```

**Error Responses:**

| Status | Code        | Description               |
|--------|-------------|---------------------------|
| 401    | unauthorized | Token tidak valid        |

---

## Presensi Endpoints

Base path: `/api/v1/presensi`

### 1. Submit Attendance

**Endpoint:** `POST /api/v1/presensi/submit`

Mengirim data presensi (masuk/keluar). Data diproses secara asinkron menggunakan queue.

#### Request

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body Parameters:**

| Parameter  | Type   | Required | Description                                                                  |
|------------|--------|----------|------------------------------------------------------------------------------|
| lat        | string | Yes      | Latitude koordinat lokasi                                                   |
| long       | string | Yes      | Longitude koordinat lokasi                                                  |
| jenis      | string | No       | Jenis presensi: `""` (WFO), `"WFH"`, `"PDL"` (default: `""`)                |
| status     | string | Yes      | Status: `"1"` (masuk) atau `"0"` (keluar)                                   |
| keterangan | string | No       | Keterangan (wajib jika jenis="PDL")                                         |
| foto       | file   | No       | Foto bukti presensi (saat ini disabled/tidak disimpan)                      |

**Body Example:**

```javascript
// Form Data
lat=-6.2088
&long=106.8456
&jenis=
&status=1
&keterangan=
```

#### Response

**Success (200 OK):**

```json
{
  "ok": true,
  "queued": true,
  "queue_id": "1708345678901-abc123xyz",
  "tgl": "2026-02-19",
  "jenis": "WFO",
  "aksi": "masuk",
  "waktu": "08:05:00",
  "lokasi": "-6.2088,106.8456",
  "foto": null,
  "terlambat": 5
}
```

**Untuk presensi keluar:**

```json
{
  "ok": true,
  "queued": true,
  "queue_id": "1708345678901-abc123xyz",
  "tgl": "2026-02-19",
  "jenis": "WFH",
  "aksi": "keluar",
  "waktu": "15:55:00",
  "lokasi": "-6.2088,106.8456",
  "foto": null,
  "pulang_awal": 5
}
```

**Error Responses:**

| Status | Code                          | Description                                    |
|--------|-------------------------------|------------------------------------------------|
| 400    | lat_long_required             | Parameter lat atau long tidak ada              |
| 400    | invalid_status                | Status harus 0 atau 1                          |
| 400    | keterangan_required_for_PDL   | Keterangan wajib diisi untuk jenis PDL         |
| 401    | unauthorized                  | Token tidak valid                              |
| 500    | server_error                  | Terjadi kesalahan server                       |

#### Notes

- Foto presensi saat ini **disabled** dan tidak disimpan (in-memory only)
- Perhitungan terlambat: selisih antara jam masuk aktual dengan jadwal masuk
- Perhitungan pulang awal: selisih antara jam keluar aktual dengan jadwal keluar
- Data diproses secara asinkron via Redis queue

---

### 2. Get Attendance History

**Endpoint:** `GET /api/v1/presensi/history`

Mengambil riwayat presensi 30 hari terakhir.

#### Request

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:** None

#### Response

**Success (200 OK):**

```json
{
  "ok": true,
  "range": {
    "start": "2026-01-20",
    "end": "2026-02-19"
  },
  "count": 20,
  "data": [
    {
      "tgl": "2026-02-19",
      "masuk": "08:05:00",
      "keluar": "16:00:00",
      "status": "WFO",
      "terlambat": 5,
      "pulang_awal": 0,
      "is_late": true,
      "is_early": false,
      "jadwal_masuk": "08:00:00",
      "jadwal_keluar": "16:00:00",
      "foto": "/uploads/foto_123.jpg",
      "foto2": "/uploads/foto_456.jpg",
      "lokasi": "-6.2088,106.8456",
      "lokasi_keluar": "-6.2088,106.8456",
      "verifikasi": "mobile",
      "skpd": "Dinas Komunikasi dan Informatika",
      "id_shift": 1,
      "keterangan": null
    },
    // ... data lainnya
  ]
}
```

**Error Responses:**

| Status | Code        | Description               |
|--------|-------------|---------------------------|
| 401    | unauthorized | Token tidak valid        |
| 500    | server_error| Terjadi kesalahan server  |

---

## Admin Endpoints

Base path: `/api/v1/admin`

**Authentication:** Set `ADMIN_API_KEY` di environment untuk mengaktifkan proteksi. Jika di-set, setiap request harus menyertakan header:

```
X-ADMIN-KEY: <value of ADMIN_API_KEY>
```

### 1. Get Queue Statistics

**Endpoint:** `GET /api/v1/admin/queue/stats`

Mengambil statistik antrian presensi.

#### Request

**Headers (if enabled):**
```
X-ADMIN-KEY: <admin_key>
```

#### Response

**Success (200 OK):**

```json
{
  "ok": true,
  "queue": {
    "key": "queue:presensi",
    "length": 15
  },
  "dlq": {
    "key": "queue:presensi:dead",
    "length": 3
  }
}
```

**Error Responses:**

| Status | Code        | Description                          |
|--------|-------------|--------------------------------------|
| 401    | unauthorized | Admin key tidak valid (jika di-set) |
| 500    | server_error| Terjadi kesalahan server             |

---

### 2. Peek Queue Items

**Endpoint:** `GET /api/v1/admin/queue/peek`

Melihat item dalam antrian tanpa menghapusnya.

#### Request

**Headers (if enabled):**
```
X-ADMIN-KEY: <admin_key>
```

**Query Parameters:**

| Parameter | Type    | Required | Default | Description                           |
|-----------|---------|----------|---------|---------------------------------------|
| count     | integer | No       | 10      | Jumlah item yang akan ditampilkan (max 100) |
| type      | string  | No       | main    | Tipe antrian: `main` atau `dlq`       |

**Example:**
```
GET /api/v1/admin/queue/peek?count=20&type=dlq
```

#### Response

**Success (200 OK):**

```json
{
  "ok": true,
  "key": "queue:presensi",
  "count": 10,
  "items": [
    {
      "id": "1708345678901-abc123xyz",
      "tgl": "2026-02-19",
      "jamNow": "08:05:00",
      "isMasuk": true,
      "lokasiStr": "-6.2088,106.8456",
      "fotoRelPath": null,
      "statusKehadiran": "",
      "terlambat": 5,
      "pulang_awal": 0,
      "meta": {
        "idtbPegawai": 123,
        "id_contact": 456,
        "skpd": "Dinas Komunikasi dan Informatika",
        "id_shift": 1,
        "jadwalMasuk": "08:00:00",
        "jadwalKeluar": "16:00:00",
        "keterangan": ""
      },
      "createdAt": "2026-02-19T08:05:00.000Z",
      "verifikasi": "mobile"
    },
    // ... item lainnya
  ]
}
```

**Error Responses:**

| Status | Code        | Description                          |
|--------|-------------|--------------------------------------|
| 401    | unauthorized | Admin key tidak valid (jika di-set) |
| 500    | server_error| Terjadi kesalahan server             |

---

### 3. Requeue Failed Jobs

**Endpoint:** `POST /api/v1/admin/queue/requeue`

Memindahkan job yang gagal dari DLQ (Dead Letter Queue) kembali ke antrian utama.

#### Request

**Headers (if enabled):**
```
X-ADMIN-KEY: <admin_key>
Content-Type: application/json
```

**Body Parameters:**

| Parameter | Type    | Required | Description                                      |
|-----------|---------|----------|--------------------------------------------------|
| id        | string  | Conditional | ID job yang akan di-requeue (jika tidak pakai `all`) |
| all       | boolean | Conditional | Requeue semua job (jika tidak pakai `id`)    |
| limit     | integer | No       | Batas jumlah job yang di-requeue (default: 50)  |

**Body Examples:**

```json
// Requeue job spesifik
{
  "id": "1708345678901-abc123xyz"
}

// Requeue semua job
{
  "all": true
}

// Requeue dengan limit
{
  "all": true,
  "limit": 100
}
```

#### Response

**Success (200 OK):**

```json
{
  "ok": true,
  "moved": 5
}
```

**Error Responses:**

| Status | Code              | Description                                      |
|--------|-------------------|--------------------------------------------------|
| 400    | id_or_all_required | Parameter `id` atau `all` harus disertakan      |
| 401    | unauthorized      | Admin key tidak valid (jika di-set)              |
| 500    | server_error      | Terjadi kesalahan server                         |

---

### 4. Clear Dead Letter Queue

**Endpoint:** `DELETE /api/v1/admin/queue/dlq`

Menghapus semua item dari Dead Letter Queue.

#### Request

**Headers (if enabled):**
```
X-ADMIN-KEY: <admin_key>
Content-Type: application/json
```

**Body Parameters:**

| Parameter | Type    | Required | Description              |
|-----------|---------|----------|--------------------------|
| confirm   | boolean | Yes      | Konfirmasi penghapusan   |

**Body Example:**

```json
{
  "confirm": true
}
```

#### Response

**Success (200 OK):**

```json
{
  "ok": true,
  "deleted": 3
}
```

**Error Responses:**

| Status | Code              | Description                                    |
|--------|-------------------|------------------------------------------------|
| 400    | confirm_required  | Body harus berisi `confirm: true`              |
| 401    | unauthorized      | Admin key tidak valid (jika di-set)            |
| 500    | server_error      | Terjadi kesalahan server                       |

---

## Error Responses

### Standard Error Format

Semua error response mengikuti format berikut:

```json
{
  "error": "error_code"
}
```

### Common Error Codes

| Status | Error Code        | Description                      |
|--------|-------------------|----------------------------------|
| 400    | bad_request       | Request tidak valid              |
| 400    | missing_parameter | Parameter wajib tidak ada        |
| 401    | unauthorized      | Tidak terautentikasi             |
| 404    | not_found         | Resource tidak ditemukan         |
| 429    | rate_limit_exceeded | Terlalu banyak request          |
| 500    | server_error      | Kesalahan internal server        |

---

## Database Schema

### tbPegawai (Tabel Pegawai)

| Column       | Type    | Description                              |
|--------------|---------|------------------------------------------|
| idtbPegawai  | int     | Primary Key                              |
| nipBaru      | varchar | NIP pegawai                              |
| idelektronik | int     | ID elektronik kontak                     |
| namaPegawai  | varchar | Nama pegawai                             |
| jabatan      | varchar | Jabatan                                  |
| skpd         | int     | ID Satuan Kerja                          |
| shift        | int     | ID Shift                                 |
| idKantor     | int     | ID Kantor/Lokasi                         |
| device_id    | varchar | ID Perangkat terdaftar                   |

### tbSatKerja (Tabel Satuan Kerja)

| Column  | Type    | Description          |
|---------|---------|----------------------|
| id      | int     | Primary Key          |
| nama    | varchar | Nama Satuan Kerja    |

### tbShiftDetail (Tabel Detail Shift)

| Column    | Type     | Description              |
|-----------|----------|--------------------------|
| id_shift  | int      | ID Shift                 |
| hari      | int      | Hari (1-7, Minggu=0)     |
| jam_masuk | time     | Jam masuk                |
| jam_keluar| time     | Jam keluar               |

### tbLokasi (Tabel Lokasi Kantor)

| Column     | Type    | Description                    |
|------------|---------|--------------------------------|
| id         | int     | Primary Key                    |
| nama_lokasi| varchar | Nama lokasi                    |
| lat        | decimal | Latitude                       |
| long       | decimal | Longitude                      |
| radius     | int     | Radius validasi (meter)        |

### tbRwKehadiran (Tabel Riwayat Kehadiran)

| Column        | Type     | Description                              |
|---------------|----------|------------------------------------------|
| idtbPegawai   | int      | ID Pegawai                              |
| id_contact    | int      | ID Kontak                               |
| tgl           | date     | Tanggal presensi                        |
| masuk         | time     | Waktu masuk                             |
| keluar        | time     | Waktu keluar                            |
| lokasi        | varchar  | Lokasi masuk (lat,long)                 |
| lokasi_keluar | varchar  | Lokasi keluar (lat,long)                |
| status        | varchar  | Status: "", "WFH", "PDL"                |
| terlambat     | int      | Terlambat (menit)                       |
| pulang_awal   | int      | Pulang awal (menit)                     |
| jadwal_masuk  | time     | Jadwal jam masuk                        |
| jadwal_keluar | time     | Jadwal jam keluar                       |
| foto          | varchar  | Path foto masuk                         |
| foto2         | varchar  | Path foto keluar                        |
| verifikasi    | varchar  | Metode verifikasi ("mobile")            |
| skpd          | int      | ID Satuan Kerja                         |
| id_shift      | int      | ID Shift                                |
| keterangan    | varchar  | Keterangan (untuk PDL)                  |

---

## Environment Variables

Berikut adalah daftar environment variables yang dapat dikonfigurasi:

| Variable          | Type   | Default          | Description                                      |
|-------------------|--------|------------------|--------------------------------------------------|
| PORT              | number | 4000             | Port server                                      |
| JWT_SECRET        | string | "change-me"      | Secret key untuk JWT                             |
| ADMIN_API_KEY     | string | -                | Admin API key (opsional, untuk proteksi admin)   |
| CORS_ORIGIN       | string | "*"              | Origin yang diizinkan untuk CORS (comma separated)|
| SHIFT_CACHE_TTL   | number | 43200            | TTL cache shift detail dalam detik (default 12 jam)|
| PRESENSI_QUEUE_KEY| string | "queue:presensi" | Redis key untuk queue presensi                   |
| PRESENSI_DLQ_KEY  | string | "queue:presensi:dead"| Redis key untuk dead letter queue          |

### Database Configuration

| Variable     | Type   | Default | Description                  |
|--------------|--------|---------|------------------------------|
| DB_HOST      | string | -       | MySQL host                   |
| DB_USER      | string | -       | MySQL user                   |
| DB_PASSWORD  | string | -       | MySQL password               |
| DB_NAME      | string | -       | MySQL database name          |

### Redis Configuration

| Variable     | Type   | Default | Description                  |
|--------------|--------|---------|------------------------------|
| REDIS_HOST   | string | -       | Redis host                   |
| REDIS_PORT   | number | 6379    | Redis port                   |
| REDIS_PASSWORD| string | -       | Redis password (opsional)    |

---

## Testing dengan cURL

Berikut adalah contoh penggunaan API dengan cURL:

### Login

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nip":"198001012000121001","device_id":"test123"}'
```

### Submit Presensi Masuk

```bash
curl -X POST http://localhost:4000/api/v1/presensi/submit \
  -H "Authorization: Bearer <token>" \
  -F "lat=-6.2088" \
  -F "long=106.8456" \
  -F "jenis=" \
  -F "status=1"
```

### Submit Presensi Keluar

```bash
curl -X POST http://localhost:4000/api/v1/presensi/submit \
  -H "Authorization: Bearer <token>" \
  -F "lat=-6.2088" \
  -F "long=106.8456" \
  -F "jenis=" \
  -F "status=0"
```

### Get History

```bash
curl -X GET http://localhost:4000/api/v1/presensi/history \
  -H "Authorization: Bearer <token>"
```

### Check Token

```bash
curl -X GET http://localhost:4000/api/v1/auth/check \
  -H "Authorization: Bearer <token>"
```

### Get Queue Stats (Admin)

```bash
curl -X GET http://localhost:4000/api/v1/admin/queue/stats \
  -H "X-ADMIN-KEY: <admin_key>"
```

---

## Version History

| Version | Date       | Changes                                          |
|---------|------------|--------------------------------------------------|
| 1.0     | 2026-02-19 | Initial documentation release                    |

---

## Support

Untuk pertanyaan atau masalah terkait API, silakan hubungi tim pengembang.

---

*Dokumentasi ini dibuat berdasarkan kode sumber Presensi Backend pada tanggal 19 Februari 2026.*
