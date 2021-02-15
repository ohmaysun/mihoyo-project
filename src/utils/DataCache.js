// 部分参考了https://blog.csdn.net/qq_45768871/article/details/110731433

class ItemCache {
  constructor (data, timeout) {
    this.data = data
    // 设定超时时间，设定为多少秒
    this.timeout = timeout
    // 创建对象时候的时间，大约设定为数据获得的时间
    this.cacheTime = (new Date()).getTime
  }
}

class ExpriesCache {
  // 定义静态数据map来作为缓存池
  static cacheMap = new Map()

  // 数据是否超时
  static isOverTime (name) {
    const data = ExpriesCache.cacheMap.get(name)

    // 没有数据 一定超时
    if (!data) return true

    // 获取系统当前时间戳
    const currentTime = (new Date()).getTime()

    // 获取当前时间与存储时间的过去的秒数
    const overTime = (currentTime - data.cacheTime) / 1000

    // 如果过去的秒数大于当前的超时时间，也返回null让其去服务端取数据
    if (Math.abs(overTime) > data.timeout) {
      // 此代码可以没有，不会出现问题，但是如果有此代码，再次进入该方法就可以减少判断。
      ExpriesCache.cacheMap.delete(name)
      return true
    }

    // 不超时
    return false
  }

  // 当前data在 cache 中是否超时
  static has (name) {
    return !ExpriesCache.isOverTime(name)
  }

  // 删除 cache 中的 data
  static delete (name) {
    return ExpriesCache.cacheMap.delete(name)
  }

  // 获取
  static get (name, pagesize, currentpage, lengthOfShowImgsList) {
    // 判断缓存是否超时
    const isDataOverTiem = ExpriesCache.isOverTime(name)
    // 根据后三个参数判断要请求到的数据，是否已经获取过
    // 第2页，每页1条0，则需要10-19条数据。若长度为10 13 20，分别表示请求过没？
    let hasRequestBefore = false // 之前未请求过
    if (lengthOfShowImgsList > (currentpage - 1) * pagesize) {
      hasRequestBefore = true // 之前请求过
    }
    // 如果 数据超时&&未请求过该波数据，返回null，但是没有超时，返回数据，而不是 ItemCache 对象
    // console.log(ExpriesCache.cacheMap)
    return (isDataOverTiem && !hasRequestBefore) ? null : ExpriesCache.cacheMap.get(name).data
  }

  // 默认存储5分钟
  static set (name, data, timeout = 300) {
    // console.log('set to cache data')
    // console.log(data)
    // 设置 itemCache
    const itemCache = new ItemCache(data, timeout)
    // 缓存
    // console.log(ItemCache)
    ExpriesCache.cacheMap.set(name, itemCache)
    // console.log(ExpriesCache.cacheMap.get(name).data)
  }
}

// 生成key值错误
const generateKeyError = new Error("Can't generate key from name and argument")

// 生成key值，以当前已请求到的数据数量为key
// 比如第一次请求，请求到0-19的20条数据，以getImages:20为key
// 总之在请求完数据，concat完了后的showImgsList.length 为key
function generateKey (name, param) {
  // 从arguments 中取得数据然后变为数组
  // const params = Array.from(argument).join(',')

  try {
    // 返回 字符串，函数名 + 函数参数
    return `${name}:${param}`
  } catch (_) {
    // 返回生成key错误
    return generateKeyError
  }
}

export {ExpriesCache, generateKey}
