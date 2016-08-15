var que = []

function highlight(text) {
  return (
    text
      .replace(/\bfunction\b/g, '<b>function</b>')
      .replace(/\breturn\b/g, '<b>return</b>')
  )
}

function groupTags(chars) {
  chars.forEach(function (char, index) {
    if (char === '<') {
      chars[index] = ['<']
      var tagStart = index
      var tagEnd = chars.indexOf('>')
      var tagLength = tagEnd - tagStart
      chars[index] = chars[tagStart].concat(chars.slice(tagStart+1, tagEnd+1))
      chars.splice(tagStart+1, tagLength)
      chars[index] = chars[index].join('')
    }
    if (char === '&') {
      chars[index] = ['&']
      var tagStart = index
      var tagEnd = chars.indexOf(';')
      var tagLength = tagEnd - tagStart
      chars[index] = chars[tagStart].concat(chars.slice(tagStart+1, tagEnd+1))
      chars.splice(tagStart+1, tagLength)
      chars[index] = chars[index].join('')
    }
  })
  return chars
}

function time(char) {
  if (char === '<br>') return 500
  if (!/[a-z]/i.test(char)) return 350
  var delay = 600 * Math.random() * Math.random() * Math.random() * Math.random()
  return delay > 50 ? delay : 50
}

function loop(element, completeContents, pos) {
  setTimeout(function () {
    if (typeof completeContents[pos] !== 'undefined') {
      element.innerHTML = ''
      element.innerHTML = completeContents.slice(0, pos+1).join('') + '|'
      pos++
      loop(element, completeContents, pos)
    } else {
      setTimeout(function () {
        element.innerHTML = completeContents.join('')
      }, 500)
      if (que.length) setTimeout(que.shift(), 700)
    }
  }, time(completeContents[pos]))
}

function typeOut(element) {
  return typeOut.add.bind(null, element)
}

typeOut.add = function (element, contents) {
  loop(element, groupTags(contents.split('')), 0)
  return typeOut
}

typeOut.then = function (func) {
  que.push(func)
  return typeOut
}

var annotationNode = document.getElementById('annotation')
var annotation = '<br>&nbsp;&nbsp;TYPEOF<br>&nbsp;&nbsp;&nbsp;&nbsp;(arguments)<br>&nbsp;&nbsp;&nbsp;&nbsp;(Number, Number)<br><br>'
var commonjsNode = document.getElementById('commonjs')
var commonjs = '<b>import</b> * <b>as</b> TYPEOF <b>from</b> \'typeof-arg\'<br><br>'

function start() {
  typeOut(commonjsNode)(commonjs)
    .then(typeOut(annotationNode).bind(null, annotation))
    .then(function () {
      setTimeout(function() {$('#done').fadeIn()}, 1000)
    })
}

setTimeout(start, 1500)
