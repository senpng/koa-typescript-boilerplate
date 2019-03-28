import fs from 'fs'

const curPath = __dirname

fs.readdirSync(curPath).forEach((item) => {
  const filePath = `${curPath}/${item}/index.js`
  if (fs.existsSync(filePath)) {

    if (item.indexOf('-') !== -1) { // xx-xx => xxXx
      const strArry = item.split('-')
      item = strArry.reduce((str, s) => {
        if (strArry[0] === s) {
          return s
        }
        return str + s.charAt(0).toUpperCase() + s.substring(1)
      })
    }

    exports[item] = require(filePath)
  }
})
