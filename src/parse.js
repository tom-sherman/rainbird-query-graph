const sax = require('sax')

export function parseDocument(rblang) {
  const parser = sax.parser({ position: true, lowercase: true })

  let currentRule = null
  let ruleIndex = 0
  const rules = []
  const facts = []
  const relationships = []
  const concepts = []
  const instances = []

  parser.onopentag = function(node) {
    if (node.name === 'relinst' && node.isSelfClosing) {
      // Fact
      facts.push({ ...node.attributes })
    } else if (node.name === 'relinst' && !node.isSelfClosing) {
      // Rule
      const {
        cf,
        'minimum-rule-certainty': minimumRuleCertainty,
        ...attributes
      } = node.attributes

      ruleIndex++

      currentRule = {
        start: parserPosition(parser),
        conditions: [],
        ruleIndex,
        cf: parseInt(cf),
        // Conditionally parseInt and assign minimum-rule-certainty
        ...(minimumRuleCertainty && { minimumRuleCertainty: parseInt(minimumRuleCertainty) }),
        ...attributes
      }
    } else if (node.name === 'condition') {
      currentRule.conditions.push(node.attributes)
    } else if (node.name === 'concept') {
      concepts.push({ ...node.attributes })
    } else if (node.name === 'concinst') {
      instances.push({ ...node.attributes })
    } else if (node.name === 'rel') {
      relationships.push({ ...node.attributes })
    }
  }

  parser.onclosetag = function(node) {
    if (node === 'relinst' && currentRule) {
      currentRule.end = parserPosition(parser)
      rules.push(currentRule)
      currentRule = null
    }
  }

  parser.onerror = function(err) {
    throw err
  }

  parser.write(rblang).end()

  return {
    rules,
    concepts,
    relationships,
    instances,
    facts
  }
}

function parserPosition(parser) {
  return {
    position: parser.position,
    line: parser.line,
    column: parser.column
  }
}
