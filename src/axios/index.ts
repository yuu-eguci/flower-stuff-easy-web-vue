import axios, { AxiosInstance, AxiosResponse } from 'axios'

export interface ProcessedResponse {
  statusCode: number
  body: unknown
  headers: Record<string, string>
}

/**
 * レスポンスデータの加工
 */
function processResponse (response: AxiosResponse): ProcessedResponse {
  return {
    statusCode: response.status,
    body: response.data,
    headers: response.headers
  }
}

/**
 * Http通信用クラス
 */
export default class Api {
  instance: AxiosInstance

  /**
   * Http通信を行うためのインスタンスを作成
   * APIが複数ある場合にも対応
   * @param baseUrl ベースURL
   * @param headers デフォルトヘッダー情報
   */
  constructor (baseUrl: string | undefined, headers: Record<string, string>) {
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
   * @param url URLパス
   * @param params クエリデータ
   */
  async get (url: string, params?: Record<string, unknown>): Promise<ProcessedResponse> {
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
   * @param url URLパス
   * @param data リクエストボディ
   */
  async post (url: string, data: unknown): Promise<ProcessedResponse> {
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
