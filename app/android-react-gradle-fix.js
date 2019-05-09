const fs = require('fs')

try {
    var curDir = __dirname
    var rootDir = process.cwd()

    var file = `${rootDir}/node_modules/react-native/react.gradle`
    var dataFix = fs.readFileSync(`${curDir}/android-react-gradle-fix`, 'utf8')

    fs.writeFileSync(file, dataFix, 'utf8')
    console.log('Done')
} catch (error) {
    console.error(error)
}
