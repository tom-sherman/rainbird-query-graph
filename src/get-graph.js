import { parseDocument } from './parse'

export function getGraph(rblang) {
  const doc = parseDocument(rblang)

  const nodes = new Set()
  const edges = []

  for (const rule of doc.rules) {
    nodes.add(rule.type)
    for (const condition of rule.conditions) {
      edgeTargetsFromCondition(condition).forEach(target => {
        nodes.add(target)
        edges.push({
          source: rule.type,
          target: target,
          id: 'e' + edges.length,
          type: 'arrow'
        })
      })
    }
  }

  return {
    nodes: Array.from(nodes).map(n => ({ label: n, id: n })),
    edges,
    doc
  }
}

function edgeTargetsFromCondition(condition) {
  const targets = []
  if (condition.rel) {
    targets.push(condition.rel)
  }

  if (condition.expression) {
    const reCountRel = /countRelationshipInstances\([%a-zA-Z_*' ]+,([%a-zA-Z_* ]+),[%a-zA-Z_*' ]+\)/
    const reSumObjects = /sumObjects\([%a-zA-Z_*' ]+,([%a-zA-Z_* ]+),[%a-zA-Z_*' ]+\)/
    const reSubset = /isSubset\([%a-zA-Z_*' ]+,([%a-zA-Z_* ]+),[%a-zA-Z_*' ]+,[%a-zA-Z_*' ]+,([%a-zA-Z_* ]+),[%a-zA-Z_*' ]+\)/

    const countRelMatches = condition.expression.match(reCountRel)
    const sumObjectsMatches = condition.expression.match(reSumObjects)
    const subsetMatches = condition.expression.match(reSubset)

    if (countRelMatches) {
      targets.push(countRelMatches[1].trim())
    }
    if (sumObjectsMatches) {
      targets.push(sumObjectsMatches[1].trim())
    }
    if (subsetMatches) {
      targets.push(subsetMatches[1].trim(), subsetMatches[2].trim())
    }
  }
  // console.log(targets)
  return targets
}
