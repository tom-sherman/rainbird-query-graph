import sax from "@msitko/sax";

export function getGraph(rblang) {
  const doc = parseDocument(rblang);

  const nodes = new Set();
  const edges = [];

  for (const rule of doc.rules) {
    nodes.add(rule.type);
    for (const condition of rule.conditions) {
      edgeTargetsFromCondition(condition).forEach(target => {
        nodes.add(target)
        edges.push({
          source: rule.type,
          target: target,
          id: "e" + edges.length,
          type: "arrow"
        })
      });
    }
  }

  return {
    nodes: Array.from(nodes).map(n => ({ label: n, id: n })),
    edges,
    doc
  };
}

function parseDocument(rblang) {
  const parser = sax.parser({ position: true, lowercase: true });

  let currentRule = null;
  let ruleIndex = 0;
  const rules = [];
  const facts = [];
  const relationships = [];
  const concepts = [];
  const instances = [];

  parser.onopentag = function(node) {
    if (node.name === "relinst" && node.isSelfClosing) {
      // Fact
      facts.push({ ...node.attributes });
    } else if (node.name === "relinst" && !node.isSelfClosing) {
      // Rule
      const { type, subject, object, cf, behaviour, alt } = node.attributes;
      ruleIndex++;
      currentRule = {
        start: parserPosition(parser),
        conditions: [],
        ruleIndex,
        type,
        subject,
        object,
        cf,
        behaviour,
        alt
      };
    } else if (node.name === "condition") {
      currentRule.conditions.push(node.attributes);
    } else if (node.name === "concept") {
      concepts.push({ ...node.attributes });
    } else if (node.name === "concinst") {
      instances.push({ ...node.attributes });
    } else if (node.name === "rel") {
      relationships.push({ ...node.attributes });
    }
  };
  parser.onclosetag = function(node) {
    if (node === "relinst" && currentRule) {
      currentRule.end = parserPosition(parser);
      rules.push(currentRule);
      currentRule = null;
    }
  };

  parser.write(rblang).end();

  return {
    rules,
    concepts,
    relationships,
    instances,
    facts
  };
}

function parserPosition(parser) {
  return {
    position: parser.position,
    line: parser.line,
    column: parser.column
  };
}

function edgeTargetsFromCondition(condition) {
  const targets = [];
  if (condition.rel) {
    targets.push(condition.rel);
  }

  if (condition.expression) {
    const reCountRel = /countRelationshipInstances\([%a-zA-Z_*' ]+,([%a-zA-Z_* ]+),[%a-zA-Z_*' ]+\)/;
    const reSumObjects = /sumObjects\([%a-zA-Z_*' ]+,([%a-zA-Z_* ]+),[%a-zA-Z_*' ]+\)/;
    const reSubset = /isSubset\([%a-zA-Z_*' ]+,([%a-zA-Z_* ]+),[%a-zA-Z_*' ]+,[%a-zA-Z_*' ]+,([%a-zA-Z_* ]+),[%a-zA-Z_*' ]+\)/;

    const countRelMatches = condition.expression.match(reCountRel);
    const sumObjectsMatches = condition.expression.match(reSumObjects);
    const subsetMatches = condition.expression.match(reSubset);

    if (countRelMatches) {
      targets.push(countRelMatches[1].trim());
    }
    if (sumObjectsMatches) {
      targets.push(sumObjectsMatches[1].trim());
    }
    if (subsetMatches) {
      targets.push(subsetMatches[1].trim(), subsetMatches[2].trim());
    }
  }
  // console.log(targets)
  return targets;
}
