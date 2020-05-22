const parse5 = require('parse5');

module.exports = function (source) {
  const templateSrc = source

  const { resourcePath } = this

  function forceTemplate(html) {
    // -------------- 解析成 html 语法树
    const htmlAst = parse5.parseFragment(html, {
      sourceCodeLocationInfo: true,
    });

    // -------------- 给标签增加源代码位置信息 
    function addLocation(node) {
      const { sourceCodeLocation } = node
      if (sourceCodeLocation) {
        const { startLine, startCol } = sourceCodeLocation
        node.attrs && node.attrs.push({
          name: 'source-code-location',
          value: `${resourcePath}:${startLine}:${startCol}`
        })
      }
    }

    // -------------- 递归 
    function walk(node) {
      addLocation(node)
      node.childNodes && node.childNodes.forEach((childNode) => {
        walk(childNode)
      })
    }
    walk(htmlAst)

    // -------------- 转换回字符串 
    const str = parse5.serialize(htmlAst);

    return str
  }

  // -------------- 编辑template的内容 --------------
  const getForcedTemplate = (content, callback) => {
    return content.replace(/<template[\\s\\S]*>([\s\S]*)<\/template>/, (str, str1) => {
      return '<template>' + callback(str1) + '<\/template>';
    });
  }
  const res = getForcedTemplate(templateSrc, forceTemplate)

  return res
}








