import Api from '../axios'

const headers = {
  'Content-Type': 'application/json'
}
const instance = new Api(process.env.VUE_APP_API_BASE_URL, headers)

/**
 * サーバのステータスを取得します。
 */
export const getStatus = async function () {
  const res = await instance.get('/api/v1/status')
  return res.body
}

/**
 * Pincode を検証し、正しい pincode であれば true を返します。
 */
export const verifyPincode = async function (pincode) {
  const res = await instance.post('/api/v1/verify-pincode', {
    pincode
  })
  return res.body
}

/**
 * 画像を送付し、予測の結果を取得します。
 */
export const predictImage = async function (base64image) {
  const res = await instance.post('/api/v1/predict-image', {
    base64image
  })
  return res.body
}
