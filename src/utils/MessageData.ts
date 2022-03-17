import { gzipSync, unzipSync } from 'zlib'

/**
 * 
 * @description API uses ZLIB to decrease the data size so it doesn't get too heavy on data reception. Also this helps with bandwidth
 * @param buf 
 * @returns {any}
 */
export function decodeData(buf: Buffer) {
  try {
    const data = unzipSync(buf, { memLevel: 9, level: 9, })
    const json = JSON.parse(data.toString())
    return json
  } catch (_) {
    throw Error(`ClientUsagi/MessageData: Error unzipping message!`)
  }
}

/**
 * 
 * @description API uses ZLIB to decrease the data size so it doesn't get too heavy on data reception. Also this helps with bandwidth
 * @param buf 
 * @returns {any}
 */
export function encodeData(message: string) {
  try {
    const data = gzipSync(Buffer.from(JSON.stringify(message), 'utf-8'), { memLevel: 9, level: 9, strategy: 2 })
    return data
  } catch (_) {
    throw Error(`ClientUsagi/MessageData: Error compressing message.`)
  }
}