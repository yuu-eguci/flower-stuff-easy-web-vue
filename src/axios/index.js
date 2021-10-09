import axios from 'axios'

/**
 * レスポンスデータの加工
 */
function processResponse (response) {
  return {
    statusCode: response.statusCode,
    body: response.data,
    headers: response.headers
  }
}

/**
 * Http通信用クラス
 */
export default class Api {
  /**
   * Http通信を行うためのインスタンスを作成
   * APIが複数ある場合にも対応
   * @param {string} baseUrl ベースURL
   * @param {*} option オプションパラメーター
   * @param {string} option.dataType Content-typeにあたるデータタイプ
   * @param {string} option.headers デフォルトヘッダー情報
   */
  constructor (baseUrl, headers) {
    this.instance = axios.create({
      baseURL: baseUrl,
      headers
      // NOTE: これがなくとも CORS block されないかどうか検証中。
      // withCredentials: true
    })
    console.info(`Created axios instance with baseURL: ${baseUrl}`)
  }

  /**
   * getメソッドの呼び出し
   * @param {string} url URLパス
   * @param {object} query クエリデータ
   */
  async get (url, params) {
    const config = {
      params
    }
    const response = await this.instance.get(url, config).catch(err => {
      if (err.response === undefined) {
        // FIXME: Network Error のとき何を返り値にすればよいか分からない。
        console.error('Network Error!!')
      }
      return err.response
    })
    return processResponse(response)
  }

  /**
   * postメソッド呼び出し
   * queryがないのはREST原則に則っているため
   * @param {string} url URLパス
   * @param {object} data リクエストボディ
   */
  async post (url, data) {
    const response = await this.instance.post(url, data).catch(err => {
      if (err.response === undefined) {
        // FIXME: Network Error のとき何を返り値にすればよいか分からない。
        console.error('Network Error!!')
      }
      return err.response
    })
    return processResponse(response)
  }
}
