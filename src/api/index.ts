import Api from '../axios'

const headers = {
  'Content-Type': 'application/json'
}
const instance = new Api(process.env.VUE_APP_API_BASE_URL, headers)

// エラー時、サーバは message を返します。
export interface ErrorResponse {
  message: string
}

export interface StatusResponse {
  ready: boolean
}

export interface VerifyPincodeResponse {
  verification_succeeded: boolean
}

export interface PredictionResult {
  id: number
  name: string
  confidence: number
}

export interface PredictImageResponse {
  result: PredictionResult[]
  hdf5_version: string
}

/**
 * サーバのステータスを取得します。
 */
export const getStatus = async function (): Promise<StatusResponse> {
  const res = await instance.get('/api/v1/status')
  return res.body as StatusResponse
}

/**
 * Pincode を検証し、正しい pincode であれば true を返します。
 */
export const verifyPincode = async function (pincode: string): Promise<VerifyPincodeResponse | ErrorResponse> {
  const res = await instance.post('/api/v1/verify-pincode', {
    pincode
  })
  return res.body as VerifyPincodeResponse | ErrorResponse
}

/**
 * 画像を送付し、予測の結果を取得します。
 */
export const predictImage = async function (base64image: string): Promise<PredictImageResponse | ErrorResponse> {
  const res = await instance.post('/api/v1/predict-image', {
    base64image
  })
  return res.body as PredictImageResponse | ErrorResponse
}
